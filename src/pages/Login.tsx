import { specialChars } from "@testing-library/user-event";
import React, { useState } from "react";
import usePasswordValidation from "../hooks/usePasswordValidation";
import { red } from "@mui/material/colors";
import NavBar from "../Components/Navbar/NavBar";
import { useTheme } from "@mui/material/styles";
import { authUser } from "../utils/loginPage.utils";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/UserContext";

const Login = () => {
  const [password, setPassword] = useState("");
  const [confirmpwd, setConfirmpwd] = useState("");
  const [isLoginActive, setisLoginActive] = useState(true);
  const [registerAttempt, setRegisterAttempt] = useState(false);
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const toggle = () => setisLoginActive(!isLoginActive);

  const { isValid, errors } = usePasswordValidation({
    password,
    confirmpwd,
    minLength: 8,
    uppercase: true,
    lowercase: true,
    number: true,
    specialChar: true,
  });

  const handleForgotPwd = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!account) {
      e.preventDefault();
      setError("No account registered!");
    } else {
      setError("");
    }
  };

  const theme = useTheme();

  return (
    <div
      style={{
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        width: "100vw",
      }}
    >
      <NavBar />
      <p>{account}</p>
      <section className="forms-section">
        <h1
          className="section-title"
          style={{ color: theme.palette.text.primary }}
        >
          Welcome to Bricked Up!
        </h1>
        <div className="forms">
          {/* Login Form */}
          <div className={`form-wrapper ${isLoginActive ? "is-active" : ""}`}>
            <button
              type="button"
              className="switcher switcher-login"
              onClick={toggle}
            >
              Login
              <span className="underline"></span>
            </button>

            <form className="form form-login">
              <fieldset>
                <legend></legend>
                <div className="input-block">
                  <label htmlFor="login-email">E-mail</label>
                  <input
                    id="login-email"
                    type="email"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    required
                  />
                </div>
                <div className="input-block">
                  <label htmlFor="login-password">Password</label>
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="forgotpwd">
                  <a
                    href="/forgot_pwd"
                    className="forgot-pwd-link"
                    onClick={handleForgotPwd}
                    style={{
                      display: "block",
                      marginTop: "10px",
                      textAlign: "center",
                    }}
                  >
                    Forgot password?
                  </a>
                  {error && (
                    <p
                      style={{
                        color: "red",
                        textAlign: "center",
                        marginTop: "10px",
                      }}
                    >
                      {error}
                    </p>
                  )}
                </div>
              </fieldset>

              <button
                type="submit"
                className="btn-login"
                onClick={async (e) => {
                  e.preventDefault();
                  const { status } = await authUser(account, password, "login");
                  if (status === 500) {
                    navigate("/500");
                  }
                  if (status === 200) {
                    navigate("/");
                  }
                }}
              >
                Login
              </button>
            </form>
          </div>

          {/* Signup Form */}
          <div className={`form-wrapper ${!isLoginActive ? "is-active" : ""}`}>
            <button
              type="button"
              className="switcher switcher-signup"
              onClick={toggle}
            >
              Sign Up
              <span className="underline"></span>
            </button>

            <form
              className="form form-signup"
              onSubmit={(e) => {
                e.preventDefault();
                setRegisterAttempt(true);
              }}
            >
              <fieldset>
                <legend>
                  Please, enter your email, password and password confirmation
                  for sign up.
                </legend>
                <div className="input-block">
                  <label htmlFor="signup-email">E-mail</label>
                  <input
                    id="signup-email"
                    type="email"
                    onChange={(e) => setAccount(e.target.value)}
                    required
                  />
                </div>
                <div className="input-block">
                  <label htmlFor="signup-password">Password</label>
                  <input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="input-block">
                  <label htmlFor="signup-password-confirm">
                    Confirm password
                  </label>
                  <input
                    id="signup-password-confirm"
                    type="password"
                    value={confirmpwd}
                    onChange={(e) => setConfirmpwd(e.target.value)}
                    required
                  />
                </div>
                {registerAttempt && !isValid && (
                  <ul>
                    {errors.length > 0 ? (
                      errors.map((err, index) => (
                        <li key={index} style={{ color: "red" }}>
                          {err}
                        </li>
                      ))
                    ) : (
                      <li style={{ color: "green" }}>All good!</li>
                    )}
                  </ul>
                )}
              </fieldset>

              {/* Signup Button */}
              <button
                type="submit"
                className="btn-signup"
                onClick={async () => {
                  const { status } = await authUser(
                    account,
                    password,
                    "signup"
                  );
                  if (status === 500) {
                    navigate("/500");
                  }
                  if (status === 200) {
                    navigate("/");
                  }
                }}
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
