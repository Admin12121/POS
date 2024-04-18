import React, { useState, Link } from "react";
import "./style.scss"; // Import styles
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you can handle the logic to send a password reset email
    console.log("Reset password email sent to:", email);
    navigate("/create_password");
  };

  return (
    <div className="ResetPassword_wrapper">
      <div className="reset_wrapper">
        <form className="form" onSubmit={handleSubmit}>
          <h2>Reset Password</h2>
          <div className="flex-column">
            <label>Email</label>
          </div>
          <div className="inputForm">
            <input
              placeholder="Enter your Email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button className="button-submit" type="submit">
            Reset Password
          </button>
        </form>
        <div className="auth-footer">
          <p>
            Powered by{" "}
            <a href="www.kantipurinfotech.com" className="kit">
              KIT
            </a>{" "}
            &nbsp;&nbsp;•&nbsp;&nbsp; ©pos, Inc. 2023. All Rights Reserved.
            &nbsp;&nbsp;• &nbsp;&nbsp;
            <a href="">Privacy Statement</a> &nbsp;&nbsp; • &nbsp;&nbsp;
            <a href="">Terms of Service</a> &nbsp;&nbsp;• &nbsp;&nbsp;
            <a href="">POS Blog</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
