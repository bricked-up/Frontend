import React, { useState } from "react";

const Login = () => {
  //to toggle over login and sign up forms i'm using usestate
  const [isLoginActive, setisLoginActive] = useState(true);

  const toggle = () => {
    setisLoginActive(!isLoginActive);
  };

  return (
    <>
      <section className="forms-section">
        <h1 className="section-title">Welcome to Bricked Up!</h1>
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
                  <input id="login-email" type="email" required />
                </div>
                <div className="input-block">
                  <label htmlFor="login-password">Password</label>
                  <input id="login-password" type="password" required />
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

            <form className="form form-signup">
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
                  <input id="signup-password" type="password" required />
                </div>
                <div className="input-block">
                  <label htmlFor="signup-password-confirm">
                    Confirm password
                  </label>
                  <input
                    id="signup-password-confirm"
                    type="password"
                    required
                  />
                </div>
              </fieldset>
              <button type="submit" className="btn-signup">
                Register
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
