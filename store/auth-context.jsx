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
  };

  const passwordTypeHandler = () => {
    setForgetPassword(true);
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
