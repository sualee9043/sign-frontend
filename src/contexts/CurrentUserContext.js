import { createContext, useState, useEffect } from "react";
import { authApiInstance } from "../utils/api";
import CircularProgress from "@mui/material/CircularProgress";

export const CurrentUserContext = createContext(null);

const injectContext = (PassedComponent) => {
  const StoreWrapper = (props) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => { 
      const getUser = async () => {
        try {
          const response = await authApiInstance.get("/member");
          const userInfo = response.data;
          setCurrentUser(userInfo);
          setLoading(false);
        } catch (error) {
          console.error("There has been an error login", error);
          setLoading(false);
        }
      };

      getUser();
    }, []);

    if (loading) {
      return <CircularProgress />;
    }

    return (
      <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
        <PassedComponent {...props} />
      </CurrentUserContext.Provider>
    );
  };
  return StoreWrapper;
};

export default injectContext;
