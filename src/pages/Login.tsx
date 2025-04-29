import { specialChars } from "@testing-library/user-event";
import React, { useState } from "react";
//using a custom react hook for validating password confirmation
import usePasswordValidation from "../hooks/usePasswordValidation";
import { red } from "@mui/material/colors";
import NavBar from "../Components/Navbar/NavBar";
import { useTheme } from "@mui/material/styles";
import authUser from "../utils/loginPage.utils";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/UserContext";

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
const Login = () => {
  const { user, setUser } = useUser();
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === "dark";

  const [password, setPassword] = useState("");
  const [confirmpwd, setConfirmpwd] = useState("");
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isFormTouched, setIsFormTouched] = useState(false);

  // to toggle between login and sign up forms
  const [isLoginActive, setisLoginActive] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { isValid, errors } = usePasswordValidation({
    password: password,
    confirmpwd: confirmpwd,
    minLength: 8,
    uppercase: true,
    lowercase: true,
    number: true,
    specialChar: true,
  });

  const toggle = () => {
    setisLoginActive(!isLoginActive);
    setAccount("");
    setPassword("");
    setConfirmpwd("");
    setError("");
    setEmailError("");
    setIsFormTouched(false);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    setAccount(value);
    setIsFormTouched(true);
    
    if (value && !validateEmail(value)) {
      setEmailError("Please enter a valid email");
    } else {
      setEmailError("");
    }
  };

  const handleForgotPwd = (e: { preventDefault: () => void; }) => {
    if (!account) {
      e.preventDefault(); // stopping navigation if there's no account (email) written
      setError("No account registered!");
    } else if (!validateEmail(account)) {
      e.preventDefault();
      setError("Please enter a valid email!");
    } else {
      setError("");
    }
  };

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
        <h1 
          className="section-title" 
          style={{ 
            color: isDark ? "#f1f5f9" : "#0f172a",
            textAlign: "center",
            fontSize: "2rem",
            margin: "2rem 0"
          }}
        >
          Welcome to Bricked Up!
        </h1>
        
        <div 
          className="forms" 
          style={{
            maxWidth: "450px",
            margin: "0 auto",
            background: isDark 
              ? "rgba(30, 41, 59, 0.8)" 
              : "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            boxShadow: isDark
              ? "0 12px 32px rgba(0, 0, 0, 0.3)"
              : "0 8px 20px rgba(0, 194, 255, 0.15)",
            border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
            overflow: "hidden"
          }}
        >
          {/* Tab buttons for switching between Login and Sign Up */}
          <div 
            style={{
              display: "flex",
              borderBottom: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`
            }}
          >
            <button
              type="button"
              className={`switcher switcher-login ${isLoginActive ? "is-active" : ""}`}
              onClick={toggle}
              style={{
                flex: 1,
                padding: "1rem",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: isLoginActive ? "600" : "400",
                color: isLoginActive 
                  ? (isDark ? "#38bdf8" : "#0ea5e9") 
                  : (isDark ? "#94a3b8" : "#64748b"),
                position: "relative",
                transition: "all 0.3s ease"
              }}
            >
              Login
              <span 
                className="underline"
                style={{
                  display: isLoginActive ? "block" : "none",
                  position: "absolute",
                  bottom: "-1px",
                  left: "0",
                  width: "100%",
                  height: "2px",
                  background: isDark ? "#38bdf8" : "#0ea5e9"
                }}
              ></span>
            </button>

            <button
              type="button"
              className={`switcher switcher-signup ${!isLoginActive ? "is-active" : ""}`}
              onClick={toggle}
              style={{
                flex: 1,
                padding: "1rem",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: !isLoginActive ? "600" : "400",
                color: !isLoginActive 
                  ? (isDark ? "#38bdf8" : "#0ea5e9") 
                  : (isDark ? "#94a3b8" : "#64748b"),
                position: "relative",
                transition: "all 0.3s ease"
              }}
            >
              Sign Up
              <span 
                className="underline"
                style={{
                  display: !isLoginActive ? "block" : "none",
                  position: "absolute",
                  bottom: "-1px",
                  left: "0",
                  width: "100%",
                  height: "2px",
                  background: isDark ? "#38bdf8" : "#0ea5e9"
                }}
              ></span>
            </button>
          </div>

          <div className={`form-wrapper ${isLoginActive ? "is-active" : ""}`}>
            <form 
              className="form form-login"
              style={{
                padding: "2rem",
                transition: "opacity 0.3s ease, transform 0.3s ease",
                opacity: isLoginActive ? 1 : 0,
                transform: isLoginActive ? "translateY(0)" : "translateY(10px)",
                pointerEvents: isLoginActive ? "all" : "none",
                position: "relative",
                zIndex: isLoginActive ? 1 : 0
              }}
              onSubmit={(e) => {
                e.preventDefault();
                setIsFormTouched(true);
              }}
            >
              <fieldset>
                <legend style={{ display: "none" }}></legend>
                <div className="input-block" style={{ marginBottom: "1.5rem" }}>
                  <label 
                    htmlFor="login-email"
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: isDark ? "#e2e8f0" : "#334155",
                      fontSize: "0.875rem"
                    }}
                  >
                    E-mail
                  </label>
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: "12px",
                        color: isDark ? "#94a3b8" : "#64748b"
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </span>
                    <input
                      id="login-email"
                      type="email"
                      value={account}
                      onChange={handleEmailChange}
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem 0.75rem 0.75rem 2.5rem",
                        border: `1px solid ${isFormTouched && emailError ? "#ef4444" : (isDark ? "#475569" : "#cbd5e1")}`,
                        borderRadius: "8px",
                        background: isDark ? "#1e293b" : "#fff",
                        color: isDark ? "#f8fafc" : "#0f172a",
                        fontSize: "1rem",
                        outline: "none",
                        transition: "border-color 0.2s ease",
                      }}
                    />
                  </div>
                  {isFormTouched && emailError && (
                    <p style={{ 
                      color: "#ef4444", 
                      fontSize: "0.75rem", 
                      marginTop: "0.3rem",
                      marginLeft: "0.2rem"
                    }}>
                      {emailError}
                    </p>
                  )}
                </div>
                
                <div className="input-block" style={{ marginBottom: "1.25rem" }}>
                  <label 
                    htmlFor="login-password"
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: isDark ? "#e2e8f0" : "#334155",
                      fontSize: "0.875rem"
                    }}
                  >
                    Password
                  </label>
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: "12px",
                        color: isDark ? "#94a3b8" : "#64748b"
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem 2.5rem",
                        border: `1px solid ${isDark ? "#475569" : "#cbd5e1"}`,
                        borderRadius: "8px",
                        background: isDark ? "#1e293b" : "#fff",
                        color: isDark ? "#f8fafc" : "#0f172a",
                        fontSize: "1rem",
                        outline: "none",
                        transition: "border-color 0.2s ease",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "12px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: isDark ? "#94a3b8" : "#64748b",
                        padding: 0
                      }}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                          <line x1="2" x2="22" y1="2" y2="22" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="forgotpwd" style={{ marginBottom: "1.5rem" }}>
                  <a
                    href="/forgot_pwd"
                    className="forgot-pwd-link"
                    onClick={handleForgotPwd}
                    style={{
                      display: "block",
                      marginTop: "0.5rem",
                      textAlign: "right",
                      color: isDark ? "#94a3b8" : "#64748b",
                      textDecoration: "none",
                      fontSize: "0.875rem",
                    }}
                  >
                    Forgot password?
                  </a>
                  {error && (
                    <p
                      style={{
                        color: "#ef4444",
                        textAlign: "right",
                        marginTop: "0.3rem",
                        fontSize: "0.75rem"
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
                onClick={async () => {
                  setIsFormTouched(true);
                  if (account && password && !emailError) {
                    const response = await authUser(account, password, "login");
                    if (response === 500) {
                      navigate("/500");
                    }
                    if (response === 200) {
                      setUser({ ...user, email: account });
                      navigate("/dashboard");
                    }
                  }
                }}
                style={{
                  width: "100%",
                  padding: "0.85rem",
                  background: "linear-gradient(to right, #0ea5e9, #6366f1)",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(6, 182, 212, 0.4)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                Login
              </button>
            </form>
          </div>

          <div className={`form-wrapper ${!isLoginActive ? "is-active" : ""}`}>
            <form
              className="form form-signup"
              style={{
                padding: "2rem",
                transition: "opacity 0.3s ease, transform 0.3s ease",
                opacity: !isLoginActive ? 1 : 0,
                transform: !isLoginActive ? "translateY(0)" : "translateY(10px)",
                pointerEvents: !isLoginActive ? "all" : "none",
                position: "relative",
                zIndex: !isLoginActive ? 1 : 0
              }}
              onSubmit={(e) => {
                e.preventDefault();
                setIsFormTouched(true);
              }}
            >
              <fieldset>
                <legend style={{ 
                  fontSize: "0.875rem", 
                  color: isDark ? "#cbd5e1" : "#475569",
                  marginBottom: "1rem" 
                }}>
                  Please enter your email, password and password confirmation for sign up.
                </legend>
                
                <div className="input-block" style={{ marginBottom: "1.5rem" }}>
                  <label 
                    htmlFor="signup-email"
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: isDark ? "#e2e8f0" : "#334155",
                      fontSize: "0.875rem"
                    }}
                  >
                    E-mail
                  </label>
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: "12px",
                        color: isDark ? "#94a3b8" : "#64748b"
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </span>
                    <input
                      id="signup-email"
                      type="email"
                      value={account}
                      onChange={handleEmailChange}
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem 0.75rem 0.75rem 2.5rem",
                        border: `1px solid ${isFormTouched && emailError ? "#ef4444" : (isDark ? "#475569" : "#cbd5e1")}`,
                        borderRadius: "8px",
                        background: isDark ? "#1e293b" : "#fff",
                        color: isDark ? "#f8fafc" : "#0f172a",
                        fontSize: "1rem",
                        outline: "none",
                        transition: "border-color 0.2s ease",
                      }}
                    />
                  </div>
                  {isFormTouched && emailError && (
                    <p style={{ 
                      color: "#ef4444", 
                      fontSize: "0.75rem", 
                      marginTop: "0.3rem",
                      marginLeft: "0.2rem"
                    }}>
                      {emailError}
                    </p>
                  )}
                </div>
                
                <div className="input-block" style={{ marginBottom: "1.5rem" }}>
                  <label 
                    htmlFor="signup-password"
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: isDark ? "#e2e8f0" : "#334155",
                      fontSize: "0.875rem"
                    }}
                  >
                    Password
                  </label>
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: "12px",
                        color: isDark ? "#94a3b8" : "#64748b"
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setIsFormTouched(true);
                      }}
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem 2.5rem",
                        border: `1px solid ${isFormTouched && !isValid && password ? "#ef4444" : (isDark ? "#475569" : "#cbd5e1")}`,
                        borderRadius: "8px",
                        background: isDark ? "#1e293b" : "#fff",
                        color: isDark ? "#f8fafc" : "#0f172a",
                        fontSize: "1rem",
                        outline: "none",
                        transition: "border-color 0.2s ease",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "12px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: isDark ? "#94a3b8" : "#64748b",
                        padding: 0
                      }}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                          <line x1="2" x2="22" y1="2" y2="22" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  {/* Real-time password validation feedback */}
                  {isFormTouched && password && !isValid && (
                    <div style={{ marginTop: "0.5rem" }}>
                      {errors.map((err, index) => (
                        <p key={index} style={{ 
                          color: "#ef4444", 
                          fontSize: "0.75rem", 
                          marginTop: "0.2rem",
                          marginLeft: "0.2rem"
                        }}>
                          • {err}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="input-block" style={{ marginBottom: "1.5rem" }}>
                  <label 
                    htmlFor="signup-password-confirm"
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: isDark ? "#e2e8f0" : "#334155",
                      fontSize: "0.875rem"
                    }}
                  >
                    Confirm password
                  </label>
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: "12px",
                        color: isDark ? "#94a3b8" : "#64748b"
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      id="signup-password-confirm"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmpwd}
                      onChange={(e) => {
                        setConfirmpwd(e.target.value);
                        setIsFormTouched(true);
                      }}
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem 2.5rem",
                        border: `1px solid ${isFormTouched && confirmpwd && password !== confirmpwd ? "#ef4444" : (isDark ? "#475569" : "#cbd5e1")}`,
                        borderRadius: "8px",
                        background: isDark ? "#1e293b" : "#fff",
                        color: isDark ? "#f8fafc" : "#0f172a",
                        fontSize: "1rem",
                        outline: "none",
                        transition: "border-color 0.2s ease",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: "absolute",
                        right: "12px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: isDark ? "#94a3b8" : "#64748b",
                        padding: 0
                      }}
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                          <line x1="2" x2="22" y1="2" y2="22" />
                        </svg>
                        ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        )}
                      </button>
                      </div>
                      {isFormTouched && confirmpwd && password !== confirmpwd && (
                      <p style={{ 
                        color: "#ef4444", 
                        fontSize: "0.75rem", 
                        marginTop: "0.3rem",
                        marginLeft: "0.2rem"
                      }}>
                        Passwords do not match
                      </p>
                      )}
                    </div>
                    </fieldset>

                    <button 
                    type="submit" 
                    className="btn-signup"
                    onClick={async () => {
                      setIsFormTouched(true);
                      if (account && password && confirmpwd && !emailError && isValid && password === confirmpwd) {
                      const response = await authUser(account, password, "signup");
                      if (response === 500) {
                        navigate("/500");
                      }
                      if (response === 200) {
                        setUser({ ...user, email: account });
                        navigate("/dashboard");
                      }
                      }
                    }}
                    style={{
                      width: "100%",
                      padding: "0.85rem",
                      background: "linear-gradient(to right, #0ea5e9, #6366f1)",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "1rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      boxShadow: "0 4px 14px rgba(6, 182, 212, 0.4)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                    >
                    Sign Up
                    </button>
                  </form>
                  </div>
                </div>
                </section>
              </div>
              );
            };

            export default Login;