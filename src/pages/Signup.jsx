import React, { useState } from "react";
import api from "../services/api"; // <-- fix this
import "./Signup.css";


const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await api.post("/signup/", {
        username: formData.name, // backend expects username
        email: formData.email,
        password: formData.password
      });

      alert(res.data.msg || "Signup successful 🎉"); // show backend message
      console.log(res.data);

      // redirect to login page
      window.location.href = "/login";
    } catch (err) {
      console.error(err.response?.data || err.message);
      // show either backend msg or full errors
      if (err.response?.data?.msg) {
        alert(err.response.data.msg);
      } else {
        alert(JSON.stringify(err.response?.data) || "Signup failed ❌");
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Join SC Collection ✨</h2>
        <p className="signup-subtitle">Create your account and start shopping</p>

        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit">Sign Up</button>
        </form>

        <p className="signup-footer">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
