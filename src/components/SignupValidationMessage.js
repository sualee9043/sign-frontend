import { ErrorMessage } from "formik";

import styles from "../routes/Login.module.css";


function SignupValidationMessage({ field }) {
  return <ErrorMessage className={styles["input-error"]} component="p" name={field}></ErrorMessage>;
}

export default SignupValidationMessage;
