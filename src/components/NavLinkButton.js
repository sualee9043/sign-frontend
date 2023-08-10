import { Link } from "react-router-dom";

import styles from "./NavLinkButton.module.css";


function NavLinkButton({ path, text, type }) {
  return (
    <Link to={`/${path}`} className={`${styles.btn} ${styles[type]}`}>
      {text}
    </Link>
  );
}

export default NavLinkButton;
