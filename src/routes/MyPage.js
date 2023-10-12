import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authApiInstance } from "../utils/api";

import NavBar from "../components/NavBar.js";

import styles from "./RoomForm.module.css";
import { CurrentUserContext } from "../contexts/CurrentUserContext";


function MyPage() {
  const { setCurrentUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await authApiInstance.post("/member/logout");
      setCurrentUser(null);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const unregister = async () => {
    try {
      await authApiInstance.post("/member/logout");
      await authApiInstance.delete(`/member`);
      setCurrentUser(null);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.container}>
      <NavBar mode="default" />
      <div className={`${styles.wrapper} ${styles.mypage}`}>
        <div onClick={logout}>로그아웃</div>
        <div onClick={unregister}>회원 탈퇴</div>
      </div>
    </div>
  );
}

export default MyPage;
