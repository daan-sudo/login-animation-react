import React, { useState } from "react";
import { Eye, EyeOff, Mail, Sparkles } from "lucide-react";
import { AnimatedCharacters } from "./AnimatedCharacters";
import "./LoginPage.css";

interface LoginPageProps {
  brandName?: string;
  title?: string;
  subtitle?: string;
  emailPlaceholder?: string;
  primaryColor?: string;
  showGoogleLogin?: boolean;
  onSubmit?: (payload: {
    email: string;
    password: string;
    remember: boolean;
  }) => void;
  errorMsg?: string;
  loading?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  brandName = "YourBrand",
  title = "Welcome back!",
  subtitle = "Please enter your details",
  emailPlaceholder = "请输入...",
  primaryColor = "#4f46e5",
  showGoogleLogin = true,
  onSubmit,
  errorMsg,
  loading = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ email, password, remember });
    }
  };

  return (
    <div className="page">
      <div
        className="left"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}e6, ${primaryColor}, ${primaryColor}cc)`,
        }}
      >
        <div className="brand">
          <div className="brand-icon">
            <Sparkles size={16} />
          </div>
          <span>{brandName}</span>
        </div>
        <div className="characters-area">
          <AnimatedCharacters
            isTyping={isTyping}
            hasSecret={!!password}
            secretVisible={showPassword}
          />
        </div>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact</a>
        </div>
        <div className="deco-grid" />
        <div className="deco-circle deco-circle-1" />
        <div className="deco-circle deco-circle-2" />
      </div>
      <div className="right">
        <div className="form-wrapper">
          <div className="mobile-brand">
            <div className="brand-icon">
              <Sparkles size={16} />
            </div>
            <span>{brandName}</span>
          </div>
          <div className="header">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <form onSubmit={handleSubmit} className="form">
            <div className="field">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                placeholder={emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="login-password">Password</label>
              <div className="password-wrap">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="options">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />{" "}
                Remember for 30 days
              </label>
              <a href="#" className="forgot">
                Forgot password?
              </a>
            </div>
            {errorMsg && <div className="error-msg">{errorMsg}</div>}
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ background: primaryColor }}
            >
              {loading ? "Signing in..." : "Log in"}
            </button>
          </form>
          {showGoogleLogin && (
            <button type="button" className="btn-google">
              <Mail size={20} /> Log in with Google
            </button>
          )}
          <p className="signup-link">
            Don't have an account? <a href="#">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};
