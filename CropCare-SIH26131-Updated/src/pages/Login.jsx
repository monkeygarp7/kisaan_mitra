import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Phone } from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (mobile.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    if (!password) {
      alert("Please enter your password");
      return;
    }

    setLoading(true);

    // Demo login
    setTimeout(() => {
      localStorage.setItem("cropcare-mobile", mobile);
      localStorage.setItem("cropcare-username", "Farmer");

      if (rememberMe) {
        localStorage.setItem("cropcare-login-saved", "true");
      } else {
        localStorage.removeItem("cropcare-login-saved");
      }

      setLoading(false);

      navigate("/dashboard");
    }, 700);
  };

  return (
    <div className="auth-page">

      <div className="auth-card auth-card-enhanced">

        {/* Logo */}
        <div className="auth-logo">
          <Phone size={28} />
          <span>CropCare</span>
        </div>

        {/* Heading */}
        <h2>
          Farmer Login
        </h2>

        <p className="auth-subtitle">
          Login using your mobile number and password
        </p>


        <form onSubmit={handleLogin}>

          {/* Mobile Number */}
          <label>
            Mobile Number
          </label>

          <div className="input-box">

            <Phone size={19} />

            <input
              type="tel"
              placeholder="Enter 10-digit mobile number"
              value={mobile}
              onChange={(e) =>
                setMobile(
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10)
                )
              }
            />

          </div>


          {/* Password */}
          <label>
            Password
          </label>

          <div className="input-box">

            <Lock size={19} />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              className="icon-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Show or hide password"
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>

          </div>


          {/* Remember + Forgot Password */}
          <div className="login-options">

            <label className="remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(e.target.checked)
                }
              />

              Remember me
            </label>

            <Link to="/forgot-password">
              Forgot password?
            </Link>

          </div>


          {/* Login Button */}
          <button
            type="submit"
            className="full-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>


        {/* Register */}
        <p className="auth-bottom">
          New farmer?{" "}
          <Link to="/register">
            Create an account
          </Link>
        </p>


        {/* Back to Home */}
        <Link
          to="/"
          className="back-home"
        >
          ← Back to Home
        </Link>

      </div>

    </div>
  );
}

export default Login;