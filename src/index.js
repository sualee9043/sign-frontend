import React from "react";
import ReactDOM from "react-dom/client";

import axios from "axios";
import App from "./App";
import "./styles.css";
import "./index.css";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Do something with the error, or simply suppress it
    return Promise.reject(error);
  }
);
// axios.defaults.validateStatus = false;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  //<React.StrictMode>
  <App />
  //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
