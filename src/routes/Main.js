import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import NavLinkButton from "../components/NavLinkButton";

import Logo from "../logo_big.svg";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import styles from "./Main.module.css";


function Main() {
  const { currentUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/home");
    }
  }, [currentUser]);

  return (
    <div>
      <div className={styles.top}>
        <img className={styles.logo} src={Logo} alt="logo" />
      </div>
      <div className={styles.bottom}>
        <NavLinkButton path="login" text="Start" type="start" />
      </div>
    </div>
  );
}

export default Main;
