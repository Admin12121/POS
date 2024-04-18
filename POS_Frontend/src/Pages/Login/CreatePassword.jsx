import React, { useState } from "react";
import "./style.scss"; // Import styles

const CreatePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you can handle the logic to create a password
    console.log("Password created:", password);
    console.log("Confirmed password:", confirmPassword);
  };

  return (
    <div className="CreatePassword_wrapper">
      <div className="create_wrapper">
        <form className="form" onSubmit={handleSubmit}>
          <h2>Create Password</h2>
          <div className="flex-column">
            <label>Password</label>
          </div>
          <div className="inputForm">
            <input
              placeholder="Enter your Password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex-column">
            <label>Confirm Password</label>
          </div>
          <div className="inputForm">
            <input
              placeholder="Confirm your Password"
              className="input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button className="button-submit" type="submit">
            Create Password
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

export default CreatePassword;
