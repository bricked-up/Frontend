import React, { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import NavBar from "../Components/Navbar/NavBar";
import { useUser } from "../hooks/UserContext";
import authUser from "../utils/loginPage.utils";

/**
 * Custom hook for password validation
 */
const usePasswordValidation = ({ 
  password = "", 
  confirmpwd = "", 
  minLength = 8, 
  uppercase = true, 
  lowercase = true, 
  number = true, 
  specialChar = true 
}) => {
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const validationErrors = [];
    if (minLength && password.length < minLength) {
      validationErrors.push(`Password must be at least ${minLength} characters`);
    }
    if (uppercase && !/[A-Z]/.test(password)) {
      validationErrors.push("Password must contain at least one uppercase letter");
    }
    if (lowercase && !/[a-z]/.test(password)) {
      validationErrors.push("Password must contain at least one lowercase letter");
    }
    if (number && !/[0-9]/.test(password)) {
      validationErrors.push("Password must contain at least one number");
    }
    if (specialChar && !/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      validationErrors.push("Password must contain at least one special character");
    }

    setErrors(validationErrors);
    setIsValid(validationErrors.length === 0);
  }, [password, confirmpwd, minLength, uppercase, lowercase, number, specialChar]);

  return { isValid, errors };
};

/**
 * Login/Signup component with form validation and authentication
 */
const Login = () => {
  const { user, setUser } = useUser();
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === "dark";

  // Form state
  const [password, setPassword] = useState("");
  const [confirmpwd, setConfirmpwd] = useState("");
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isFormTouched, setIsFormTouched] = useState(false);
  const [isLoginActive, setIsLoginActive] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation
  const { isValid, errors } = usePasswordValidation({
    password,
    confirmpwd,
    minLength: 8,
    uppercase: true,
    lowercase: true,
    number: true,
    specialChar: true,
  });

  // UI styles
  const styles = {
    container: {
      backgroundColor: theme.palette.background.default,
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    formContainer: {
      maxWidth: "450px",
      width: "100%",
      margin: "2rem auto",
      background: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(10px)",
      borderRadius: "16px",
      boxShadow: isDark ? "0 12px 32px rgba(0, 0, 0, 0.3)" : "0 8px 20px rgba(0, 194, 255, 0.15)",
      border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
      overflow: "hidden"
    },
    title: {
      color: isDark ? "#f1f5f9" : "#0f172a",
      textAlign: "center",
      fontSize: "2rem",
      margin: "2rem 0"
    },
    tabButton: (active: any): React.CSSProperties => ({
      flex: 1,
      padding: "1rem",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: active ? "600" : "400",
      color: active ? (isDark ? "#38bdf8" : "#0ea5e9") : (isDark ? "#94a3b8" : "#64748b"),
      position: "relative",
      transition: "all 0.3s ease"
    }),
    tabIndicator: {
      position: "absolute",
      bottom: "-1px",
      left: "0",
      width: "100%",
      height: "2px",
      background: isDark ? "#38bdf8" : "#0ea5e9"
    },
    formWrapper: (active: any): React.CSSProperties => ({
      padding: "2rem",
      transition: "opacity 0.3s ease, transform 0.3s ease",
      opacity: active ? 1 : 0,
      transform: active ? "translateY(0)" : "translateY(10px)",
      pointerEvents: active ? "auto" : "none",
      position: "relative",
      zIndex: active ? 1 : 0
    }),
    inputContainer: {
      marginBottom: "1.5rem"
    },
    label: {
      display: "block",
      marginBottom: "0.5rem",
      color: isDark ? "#e2e8f0" : "#334155",
      fontSize: "0.875rem"
    },
    inputWrapper: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    },
    icon: {
      position: "absolute",
      left: "12px",
      color: isDark ? "#94a3b8" : "#64748b"
    },
    input: (hasError: any) => ({
      width: "100%",
      padding: "0.75rem 0.75rem 0.75rem 2.5rem",
      border: `1px solid ${hasError ? "#ef4444" : (isDark ? "#475569" : "#cbd5e1")}`,
      borderRadius: "8px",
      background: isDark ? "#1e293b" : "#fff",
      color: isDark ? "#f8fafc" : "#0f172a",
      fontSize: "1rem",
      outline: "none",
      transition: "border-color 0.2s ease",
    }),
    errorText: {
      color: "#ef4444", 
      fontSize: "0.75rem", 
      marginTop: "0.3rem",
      marginLeft: "0.2rem"
    },
    submitButton: {
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
    },
    forgotPasswordLink: {
      display: "block",
      marginTop: "0.5rem",
      textAlign: "right",
      color: isDark ? "#94a3b8" : "#64748b",
      textDecoration: "none",
      fontSize: "0.875rem",
    }
  };

  // Form handling functions
  const toggle = () => {
    setIsLoginActive(!isLoginActive);
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
      e.preventDefault();
      setError("No account registered!");
    } else if (!validateEmail(account)) {
      e.preventDefault();
      setError("Please enter a valid email!");
    } else {
      setError("");
    }
  };

  // Auth handler
  const handleAuth = async (type: string) => {
    setIsFormTouched(true);
    const isSignup = type === "signup";
    
    if (!account || !password || (isSignup && !confirmpwd)) {
      setError("Please fill in all required fields");
      return;
    }
    
    if (emailError) return;
    
    if (isSignup && (!isValid || password !== confirmpwd)) {
      setError("Please fix password validation errors");
      return;
    }
    
    try {
      const response = await authUser(account, password, type);
      if (response === 500) {
        navigate("/500");
      }
      if (response === 200) {
        setUser({ ...user, email: account });
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Authentication failed. Please try again.");
    }
  };

  // Icon components
  const EmailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );

  const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );

  const EyeIcon: React.FC<{ visible: boolean }> = ({ visible }) => visible ? (
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
  );

  // Input field component
  interface InputFieldProps {
    id: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon: React.ReactNode;
    hasError: boolean;
    placeholder?: string;
    toggleVisibility?: () => void;
    showPassword?: boolean;
  }

  const InputField: React.FC<InputFieldProps> = ({ id, type, value, onChange, icon, hasError, placeholder, toggleVisibility, showPassword }) => (
    <div style={styles.inputWrapper as React.CSSProperties}>
      <span style={styles.icon as React.CSSProperties}>{icon}</span>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder || ""}
        style={styles.input(hasError)}
      />
      {toggleVisibility && (
        <button
          type="button"
          onClick={toggleVisibility}
          style={{
            position: "absolute",
            right: "12px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: isDark ? "#94a3b8" : "#64748b",
            padding: 0
          }}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          <EyeIcon visible={!!showPassword} />
        </button>
      )}
    </div>
  );

  return (
    <div style={styles.container as React.CSSProperties}>
      <NavBar />
      
      <section className="forms-section">
        <h1 style={styles.title as React.CSSProperties}>Welcome to Bricked Up!</h1>
        
        <div style={styles.formContainer}>
          {/* Tab buttons */}
          <div style={{ display: "flex", borderBottom: `1px solid ${isDark ? "#334155" : "#e2e8f0"}` }}>
            <button 
              type="button" 
              onClick={toggle} 
              style={styles.tabButton(isLoginActive) as React.CSSProperties}
            >
              Login
              {isLoginActive && <span style={styles.tabIndicator as React.CSSProperties}></span>}
            </button>
            <button 
              type="button" 
              onClick={toggle} 
              style={styles.tabButton(!isLoginActive)}
            >
              Sign Up
              {!isLoginActive && <span style={styles.tabIndicator as React.CSSProperties}></span>}
            </button>
          </div>

          {/* Login Form */}
          <div style={styles.formWrapper(isLoginActive)}>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAuth("login");
            }}>
              <div style={styles.inputContainer}>
                <label htmlFor="login-email" style={styles.label}>E-mail</label>
                <InputField
                  id="login-email"
                  type="email"
                  value={account}
                  onChange={handleEmailChange}
                  icon={<EmailIcon />}
                  hasError={isFormTouched && !!emailError}
                  placeholder="Enter your email"
                />
                {isFormTouched && emailError && <p style={styles.errorText}>{emailError}</p>}
              </div>
              
              <div style={styles.inputContainer}>
                <label htmlFor="login-password" style={styles.label}>Password</label>
                <InputField
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPassword(e.target.value)}
                  icon={<LockIcon />}
                  toggleVisibility={() => setShowPassword(!showPassword)}
                  showPassword={showPassword}
                  placeholder="Enter your password" hasError={false}                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <a href="/forgot_pwd" style={styles.forgotPasswordLink as React.CSSProperties} onClick={handleForgotPwd}>
                  Forgot password?
                </a>
                {error && <p style={{ ...styles.errorText, textAlign: "right" }}>{error}</p>}
              </div>

              <button 
                type="submit" 
                style={styles.submitButton}
              >
                Login
              </button>
            </form>
          </div>

          {/* Sign Up Form */}
          <div style={styles.formWrapper(!isLoginActive)}>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAuth("signup");
            }}>
              <div style={styles.inputContainer}>
                <label htmlFor="signup-email" style={styles.label}>E-mail</label>
                <InputField
                  id="signup-email"
                  type="email"
                  value={account}
                  onChange={handleEmailChange}
                  icon={<EmailIcon />}
                  hasError={isFormTouched && !!emailError}
                  placeholder="Enter your email"
                />
                {isFormTouched && emailError && <p style={styles.errorText}>{emailError}</p>}
              </div>
              
              <div style={styles.inputContainer}>
                <label htmlFor="signup-password" style={styles.label}>Password</label>
                <InputField
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => {
                    setPassword(e.target.value);
                    setIsFormTouched(true);
                  }}
                  icon={<LockIcon />}
                  hasError={!!(isFormTouched && !isValid && password)}
                  placeholder="Enter your password"
                  toggleVisibility={() => setShowPassword(!showPassword)}
                  showPassword={showPassword}
                />
                {isFormTouched && password && !isValid && (
                  <div style={{ marginTop: "0.5rem" }}>
                    {errors.map((err, index) => (
                      <p key={index} style={styles.errorText}>• {err}</p>
                    ))}
                  </div>
                )}
              </div>
              
              <div style={styles.inputContainer}>
                <label htmlFor="signup-password-confirm" style={styles.label}>Confirm password</label>
                <InputField
                  id="signup-password-confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmpwd}
                  onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => {
                    setConfirmpwd(e.target.value);
                    setIsFormTouched(true);
                  }}
                  icon={<LockIcon />}
                  hasError={isFormTouched && !!confirmpwd && password !== confirmpwd}
                  placeholder="Confirm your password"
                  toggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
                  showPassword={showConfirmPassword}
                />
                {isFormTouched && confirmpwd && password !== confirmpwd && (
                  <p style={styles.errorText}>Passwords do not match</p>
                )}
              </div>

              {error && <p style={styles.errorText}>{error}</p>}

              <button 
                type="submit" 
                style={styles.submitButton}
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