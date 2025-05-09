import { specialChars } from "@testing-library/user-event"; // This import seems unused
import React, { useState, FormEvent } from "react"; // Added FormEvent
//using a custom react hook for validating password confirmation
import usePasswordValidation from "../hooks/usePasswordValidation";
import { red } from "@mui/material/colors"; // This import seems unused
import NavBar from "../Components/Navbar/NavBar";
import { useTheme } from "@mui/material/styles";
import authUser from "../utils/loginPage.utils";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/UserContext";
import { User } from "../utils/types"; // EDITED PART - START: Import the User type
// EDITED PART - END

/**
 * provides the UI for logging into an existing account or signing up for a new account.
 *
 * It toggles between the login and sign-up forms based on the state (`isLoginActive`).
 *
 * For the signup form, it checks for password requirements (minimum nr of chars,
 * uppercase/lowercase symbols, special chars etc) as well as validates the
 * confirm password choice.
 *
 * The component uses a custom React hook (`usePasswordValidation`) for validating
 * the password against required criteria.
 *
 * In case user forgets password, it first checks if they input an account, then
 * they can go to forget password link.
 *
 * @component
 * @example
 * return(
 * <Login />
 * );
 */
const Login = () => {
  // const { user, setUser } = useUser(); // 'user' from context is not used when setting a NEW user object after login/signup.
  const { setUser } = useUser(); // EDITED PART - START: We only need setUser.
  // EDITED PART - END

  const [password, setPassword] = useState(""); // This will be signup password
  const [loginPasswordInput, setLoginPasswordInput] = useState(""); // EDITED PART - START: Separate state for login password
  // EDITED PART - END
  const [confirmpwd, setConfirmpwd] = useState(""); //for checking if password and confirmation are =

  //to toggle over login and sign up forms i'm using usestate
  const [isLoginActive, setisLoginActive] = useState(true);
  const [registerAttempt, setRegisterAttempt] = useState(false);

  const [account, setAccount] = useState(""); // This state will hold the email for both login and signup forms

  // EDITED PART - START: Add state for signup display name and name as they are required by User type
  const [signupDisplayName, setSignupDisplayName] = useState("");
  const [signupName, setSignupName] = useState("");
  // EDITED PART - END

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // EDITED PART - START: Added isLoading state
  // EDITED PART - END


  const navigate = useNavigate();

  const toggle = () => {
    setisLoginActive(!isLoginActive);
    setError(""); // EDITED PART - START: Clear errors on toggle
    setRegisterAttempt(false); // Reset register attempt state
    // EDITED PART - END
  };

  const { isValid, errors } = usePasswordValidation({
    password: password, // This 'password' state is used for the signup form's password input
    confirmpwd: confirmpwd,
    minLength: 8,
    uppercase: true,
    lowercase: true,
    number: true,
    specialChar: true,
  });

  // This function is now the onSubmit handler for the signup form
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterAttempt(true);

    if (!isValid) { // Check password validation status
      setError("Please ensure your password meets all criteria.");
      return;
    }
    if (password !== confirmpwd) { // 'password' here is signupPassword
        setError("Passwords do not match.");
        return;
    }
    if (!signupDisplayName.trim() || !signupName.trim() || !account.trim()) { // 'account' is signupEmail
        setError("Please fill all required fields: Display Name, Full Name, and Email for signup.");
        return;
    }

    setIsLoading(true); // EDITED PART - START: Set loading state
    setError("");
    try {
      // 'account' is the email, 'password' is the signup password
      // Assuming authUser for signup now needs displayName and name.
      // If your authUser only takes 3 args, this call needs to match its definition.
      // For now, assuming it can take these or they are handled differently by your backend.
      const response = await authUser(account, password, "signup" /*, signupDisplayName, signupName */); // Pass additional details if authUser supports it

      if (response === 500) {
        navigate("/500");
      } else if (response === 200) {
        // EDITED PART - START
        // CRITICAL FIX: Construct a NEW, COMPLETE User object.
        // This data should ideally come from your backend API response.
        const signedUpUser: User = {
          id: Date.now() + 1, // Placeholder: Get actual ID from backend response
          displayName: signupDisplayName, // From signup form state
          email: account, // 'account' state holds the email from signup form
          name: signupName, // From signup form state
          password: "",   // Per your User type. Not recommended for frontend state.
          verified: false, // Typically false after signup. Get from backend.
          avatar: null,
          organizations: [],
          projects: [],
          issues: [],
          sessions: [],
        };
        setUser(signedUpUser);
        // EDITED PART - END
        navigate("/dashboard");
      } else {
        setError("Signup failed. Please try again."); // More specific error if available
      }
    } catch (err) {
        console.error("Signup error:", err);
        setError("An unexpected error occurred during signup.");
    } finally {
        setIsLoading(false); // Set loading false
    }
    // EDITED PART - END
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

  // EDITED PART - START: Added a specific submit handler for the login form
  const handleLoginInternalSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
        // 'account' state is loginEmail, 'loginPasswordInput' is loginPassword
        const response = await authUser(account, loginPasswordInput, "login");
        if (response === 500) {
            navigate("/500");
        } else if (response === 200) {
            // CRITICAL FIX: Construct a NEW, COMPLETE User object.
            const loggedInUser: User = {
                id: Date.now(), // Placeholder: Get actual ID from backend response
                displayName: account.split('@')[0] || "User", // Placeholder: Get from backend
                email: account,
                name: account.split('@')[0] || "User Name", // Placeholder: Get from backend
                password: "",   // Per your User type. Not recommended for frontend state.
                verified: true, // Placeholder: Get from backend
                avatar: null,
                organizations: [],
                projects: [],
                issues: [],
                sessions: [],
            };
            setUser(loggedInUser);
            navigate("/dashboard");
        } else {
            setError("Login failed. Please check your credentials.");
        }
    } catch (err) {
        console.error("Login error:", err);
        setError("An unexpected error occurred during login.");
    } finally {
        setIsLoading(false);
    }
  };
  // EDITED PART - END

  return (
    <div
      style={{
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        width: "100vw",
      }}
    >
      <NavBar />
      {/* <p>{account}</p> // This was for debugging */}
      {error && <p style={{color: "red", textAlign: "center"}}>{error}</p>} {/* Display general errors */}
      <section className="forms-section">
        <h1 className="section-title" style={{ color: theme.palette.text.primary }}>Welcome to Bricked Up!</h1>
        <div className="forms">
          <div className={`form-wrapper ${isLoginActive ? "is-active" : ""}`}>
            <button
              type="button"
              className="switcher switcher-login"
              onClick={toggle}
              disabled={isLoginActive || isLoading} // EDITED: Disable button
            >
              Login
              <span className="underline"></span>
            </button>

            {/* EDITED PART - START: Changed button onClick to form onSubmit */}
            <form className="form form-login" onSubmit={handleLoginInternalSubmit}>
              <fieldset disabled={isLoading}> {/* EDITED: Disable fieldset */}
            {/* EDITED PART - END */}
                <legend></legend>
                <div className="input-block">
                  <label htmlFor="login-email">E-mail</label>
                  <input
                    id="login-email"
                    type="email"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    required
                    autoComplete="email" // EDITED: Added autocomplete
                  />
                </div>
                <div className="input-block">
                  <label htmlFor="login-password">Password</label>
                  {/* EDITED PART - START: Use loginPasswordInput state */}
                  <input
                    id="login-password"
                    type="password"
                    value={loginPasswordInput}
                    onChange={(e) => setLoginPasswordInput(e.target.value)}
                    required
                    autoComplete="current-password" // EDITED: Added autocomplete
                  />
                  {/* EDITED PART - END */}
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
                  {/* Error for this is now handled by the main 'error' state display */}
                </div>
              </fieldset>

              {/* EDITED PART - START: Button type is submit, onClick removed */}
              <button type="submit" className="btn-login" disabled={isLoading}>
                {isLoading && isLoginActive ? "Logging in..." : "Login"} {/* EDITED: Loading text */}
              </button>
              {/* EDITED PART - END */}
            </form>
          </div>

          <div className={`form-wrapper ${!isLoginActive ? "is-active" : ""}`}>
            <button
              type="button"
              className="switcher switcher-signup"
              onClick={toggle}
              disabled={!isLoginActive || isLoading} // EDITED: Disable button
            >
              Sign Up
              <span className="underline"></span>
            </button>

            {/* EDITED PART - START: Changed button onClick to form onSubmit, using handleRegisterSubmit */}
            <form
              className="form form-signup"
              onSubmit={handleRegisterSubmit} // Use the modified handleRegisterSubmit
            >
              <fieldset disabled={isLoading}> {/* EDITED: Disable fieldset */}
            {/* EDITED PART - END */}
                <legend>
                  Please, enter your email, password and password confirmation
                  for sign up.
                </legend>
                {/* EDITED PART - START: Added inputs for displayName and name */}
                <div className="input-block">
                  <label htmlFor="signup-displayName">Display Name</label>
                  <input
                    id="signup-displayName"
                    type="text"
                    value={signupDisplayName}
                    onChange={(e) => setSignupDisplayName(e.target.value)}
                    required
                    autoComplete="username"
                  />
                </div>
                <div className="input-block">
                  <label htmlFor="signup-name">Full Name</label>
                  <input
                    id="signup-name"
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                    autoComplete="name"
                  />
                </div>
                {/* EDITED PART - END */}
                <div className="input-block">
                  <label htmlFor="signup-email">E-mail</label>
                  <input id="signup-email" type="email" value={account} onChange={(e) => setAccount(e.target.value)} required autoComplete="email"/>
                </div>
                <div className="input-block">
                  <label htmlFor="signup-password">Password</label>
                  <input
                    id="signup-password"
                    type="password"
                    value={password} // This 'password' state is for signup password
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setRegisterAttempt(false); // Optionally reset on change
                    }}
                    required
                    autoComplete="new-password"
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
                    onChange={(e) => {
                        setConfirmpwd(e.target.value);
                        setRegisterAttempt(false); // Optionally reset on change
                    }}
                    required
                    autoComplete="new-password"
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
                      null // Don't show "All good!" if !isValid
                    )}
                  </ul>
                )}
              </fieldset>
              {/* EDITED PART - START: Button type is submit, onClick removed */}
              <button type="submit" className="btn-signup" disabled={isLoading}>
                {isLoading && !isLoginActive ? "Registering..." : "Register"} {/* EDITED: Loading text */}
              </button>
              {/* EDITED PART - END */}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;