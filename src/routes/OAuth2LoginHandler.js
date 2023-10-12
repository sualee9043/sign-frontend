import { useContext, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import { axiosInstance, authApiInstance } from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";


function OAuth2LoginHandler() {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(CurrentUserContext);
  
  const { provider } = useParams();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const code = params.get('code');
  
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await authApiInstance.get("/member");
        const userInfo = response.data;
        setCurrentUser(userInfo);
      } catch (error) {
        console.error("There has been an error getUser", error);
      }
    };

    const login = async () => {
      try {
        const response = await axiosInstance.get(`/login/oauth2/code/${provider}`, {params: {code: code}});
        const headers = response.headers;
        authApiInstance.defaults.headers.common["Access-Token"] = headers["access-token"];
        getUser().then(() => {
          navigate("/home");
        });
      } catch (error) {
        console.error("There has been an error getUser", error);
      }
    }

    login();
  }, []);
  
  return null;
}

export default OAuth2LoginHandler;