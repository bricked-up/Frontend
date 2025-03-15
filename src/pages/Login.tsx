/**
 * provides the UI for logging into an existing account or signing up for a new account.
 *
 * It toggles between the login and sign-up forms based on the state (`isLoginActive`).
 *
 * For the signup form, it checks for password requirements (minimum nr of chars,
 *  uppercase/lowercase symbols, special chars etc) as well as validates the
 *  confirm password choice.
 *
 * The component uses a custom React hook (`usePasswordValidation`) for validating
 *  the password against required criteria.
 *
 * In case user forgets password, it first checks if they input an account, then
 *  they can go to forget password link.
 *
 * @component
 * @example
 * return(
 *  <Login />
 * );
 */
import { specialChars } from "@testing-library/user-event";
import React, { useState } from "react";
//using a custom react hook for validating password confirmation
import usePasswordValidation from "../hooks/usePasswordValidation";
import { red } from "@mui/material/colors";
import NavBar from "../Components/NavBar";
import { useTheme } from "@mui/material/styles";

// typescript file for Log In & Sign Up page
const Login = () => {
  const [password, setPassword] = useState("");
  const [confirmpwd, setConfirmpwd] = useState(""); //for checking if password and confirmation are =


  //to toggle over login and sign up forms i'm using usestate
  const [isLoginActive, setisLoginActive] = useState(true);
  const [registerAttempt, setRegisterAttempt] = useState(false);

  const [account, setAccount] = useState(""); //for checking if user has input an email for verification
  const [error, setError] = useState("");

  const toggle = () => {
    setisLoginActive(!isLoginActive);
  };

  const { isValid, errors } = usePasswordValidation({
    password: password,
    confirmpwd: confirmpwd,
    minLength: 8,
    uppercase: true,
    lowercase: true,
    number: true,
    specialChar: true,
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterAttempt(true);
  };

  const handleForgotPwd = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!account) {
      e.preventDefault(); //stopping navigation if there's no account (email) written
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
      <section className="forms-section">
        <h1 className="section-title" style={{ color: theme.palette.text.primary }}>Welcome to Bricked Up!</h1>
        <div className="forms">
          {/*dynamically switching between the css classes*/}
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
                  <input id="login-password" type="password" required />
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
                    {" "}
                    Forgot password?{" "}
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

              <button type="submit" className="btn-login">
                Login
              </button>
            </form>
          </div>

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
                  <input id="signup-email" type="email" required />
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
              <button type="submit" className="btn-signup">
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
