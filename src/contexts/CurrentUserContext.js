import { createContext, useState, useEffect } from "react";

export const CurrentUserContext = createContext(null);

const injectContext = (PassedComponent) => {
  const StoreWrapper = (props) => {
    const [currentUser, setCurrentUser] = useState(null);
    return (
      <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
        <PassedComponent {...props} />
      </CurrentUserContext.Provider>
    );
  };
  return StoreWrapper;
};

export default injectContext;
