import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importing icons for show/hide password
import "./LoginPage.css"; // Import the CSS file

function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? "/register" : "/login";
    const currentOrigin = window.location.origin;
    const url = `${new URL(currentOrigin).protocol}//${new URL(currentOrigin).hostname}:5000${endpoint}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        if (!isRegister) {
          localStorage.setItem("token", data.token);
          alert("Login successful");
          navigate("/data-entry");
        } else {
          alert("Registration successful");
          setIsRegister(false);
        }
      } else {
        alert(data.error || "An error occurred");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to connect to the server");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>{isRegister ? "Register" : "Login"}</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <div
                className="show-password-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
          </div>
          <button type="submit" className="submit-btn">
            {isRegister ? "Register" : "Login"}
          </button>
          <button
            type="button"
            className="switch-btn"
            onClick={() => setIsRegister(!isRegister)}
          >
            Switch to {isRegister ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
