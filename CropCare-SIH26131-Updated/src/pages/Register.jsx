import { Link, useNavigate } from "react-router-dom";
import { Leaf, User, Mail, Lock, Phone } from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    localStorage.setItem("cropcare-username", form.get("name") || "Farmer");
    localStorage.setItem("cropcare-mobile", form.get("mobile") || "");
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          <Leaf size={35} />
          <h1>CropCare</h1>
        </div>

        <h2>Create Account</h2>

        <p className="auth-subtitle">
          Start protecting your crops
        </p>

        <form onSubmit={handleRegister}>

          <label>Full Name</label>

          <div className="input-box">
            <User size={19} />
            <input
              name="name"
              type="text"
              placeholder="Enter your name"
              required
            />
          </div>

          <label>Mobile Number</label>

          <div className="input-box">
            <Phone size={19} />
            <input
              name="mobile"
              type="tel"
              placeholder="Enter mobile number"
              required
            />
          </div>

          <label>Email</label>

          <div className="input-box">
            <Mail size={19} />
            <input
              type="email"
              placeholder="Enter email"
              required
            />
          </div>

          <label>Password</label>

          <div className="input-box">
            <Lock size={19} />
            <input
              type="password"
              placeholder="Create password"
              required
            />
          </div>

          <button className="full-btn">
            Create Account
          </button>

        </form>

        <p className="auth-bottom">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>

      </div>

    </div>
  );
}

export default Register;