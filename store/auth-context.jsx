import React, { useState } from "react";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
  forgetPassword: false,
  changePasswordHandler: () => {},
});

export const AuthContextProvider = (props) => {
  const initalToken = localStorage.getItem("split-token");
  const [token, setToken] = useState(initalToken);
  const userIsLoggedIn = !!token;
  const [forgetPassword, setForgetPassword] = useState(false);
  const userClickedForgetPassword = !!forgetPassword;

  const loginHandler = (token) => {
    setToken(token);
    localStorage.setItem("split-token", token);
  };
  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem("split-token");
    localStorage.removeItem("user-mail");
    localStorage.removeItem("changed-mail");
    localStorage.removeItem("inviteCode");
    localStorage.removeItem("sheetCode");

    setTimeout(() => {
      location.reload();
    }, 1500);
  };

  const passwordTypeHandler = () => {
    setForgetPassword((forgetPassword) => !forgetPassword);
  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    forgetPassword: userClickedForgetPassword,
    changePasswordHandler: passwordTypeHandler,
  };
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
