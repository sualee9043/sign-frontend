import { useContext, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import { authApiInstance } from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { extractToken } from "../utils/tokenUtils"


function OAuth2LoginHandler() {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(CurrentUserContext);
  
  const { provider } = useParams();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const code = params.get('code');
  
  

  useEffect(() => {
    const getUser = async (accessToken) => {
      try {
        const response = await authApiInstance.get("/member",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        const userInfo = response.data;
        setCurrentUser((currentUser) => ({ ...currentUser, ...userInfo }));
      } catch (error) {
        console.error("There has been an error getUser", error);
      }
    };

    const login = async () => {
      try {
        const response = await authApiInstance.get(`/login/oauth2/code/${provider}`, {params: {code: code}});
        const headers = response.headers;
        const accessToken = extractToken(headers["authorization"]);
        setCurrentUser((currentUser) => ({ ...currentUser, accessToken: accessToken }));
        getUser(accessToken).then(() => {
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