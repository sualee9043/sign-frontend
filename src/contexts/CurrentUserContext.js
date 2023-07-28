import { createContext, useState, useEffect } from "react";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

export const CurrentUserContext = createContext(null);

const injectContext = (PassedComponent) => {
  const StoreWrapper = (props) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      const getUser = async () => {
        try {
          const response = await axios.get("/member");
          const userInfo = response.data;
          setCurrentUser(userInfo);
          axios.defaults.headers.common["Access-Token"] = response.headers["access-token"];
          setLoading(false);
        } catch (error) {
          console.error("There has been an error login", error);
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
