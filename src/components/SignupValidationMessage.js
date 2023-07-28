import styles from "../routes/Login.module.css";
import { ErrorMessage } from "formik";

function SignupValidationMessage({ field }) {
  return <ErrorMessage className={styles["input-error"]} component="p" name={field}></ErrorMessage>;
}

export default SignupValidationMessage;
