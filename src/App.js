import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./routes/Home";
import Classroom from "./routes/Classroom";
import Login from "./routes/Login";
import OAuth2LoginHandler from "./routes/OAuth2LoginHandler";
import Signup from "./routes/Signup";
import Main from "./routes/Main";
import injectContext from "./contexts/CurrentUserContext";
import CreateRoom from "./routes/CreateRoom";
import EnterRoom from "./routes/EnterRoom";
import MyPage from "./routes/MyPage";
import UpdateRoom from "./routes/UpdateRoom";
import AuthInterceptor from "./utils/api";


const App = () => {
  return (
    <BrowserRouter>
      <AuthInterceptor />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/oauth2/code/:provider" element={<OAuth2LoginHandler />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/classroom/:roomId" element={<Classroom />} />
        <Route path="/createroom" element={<CreateRoom />} />
        <Route path="/enterroom" element={<EnterRoom />} />
        <Route path="/updateroom" element={<UpdateRoom />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default injectContext(App);
