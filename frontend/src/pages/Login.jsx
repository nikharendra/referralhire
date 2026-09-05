import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import PasswordInput from "../components/PasswordInput";
import Logo from "../components/Logo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data);
      navigate(res.data.role === "hr" ? "/hr" : "/employee");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-auth">
      <div className="split-brand">
        <Logo size={44} fontSize={17} />
        <h1>Employee Referral Management, Simplified</h1>
        <p className="tagline">
          Turn your employees into your strongest hiring engine — post roles,
          track referrals, and automate payouts.
        </p>
        <div className="split-welcome">
          <div className="split-welcome-title">👋 Welcome back</div>
          <p>
            Log in to manage your job postings, referrals, and payouts from one
            dashboard.
          </p>
        </div>
      </div>

      <div className="split-form-side">
        <div className="split-form-inner">
          <div className="auth-toggle">
            <Link to="/login" className="active">
              Sign In
            </Link>
            <Link to="/signup">Sign Up</Link>
          </div>

          <h2>Sign In</h2>
          <p className="text-muted" style={{ marginBottom: 24 }}>
            Login to your ReferralHire account
          </p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Email</label>
              <input
                className="input"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>Password</label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <p style={{ textAlign: "right", marginTop: -6, marginBottom: 14 }}>
              <Link
                to="/forgot-password"
                className="auth-link"
                style={{ fontSize: 13 }}
              >
                Forgot password?
              </Link>
            </p>

            {error && <div className="msg-error">{error}</div>}

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Sign In →"}
            </button>
          </form>

          <p
            className="text-muted"
            style={{ textAlign: "center", marginTop: 18 }}
          >
            Don't have an account?{" "}
            <Link to="/signup" className="auth-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
