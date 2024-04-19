import React from 'react'
import './style.scss'
const Resetpassword = () => {
  return (
    <div className="ResetPassword_wrapper">
      <div className="reset_wrapper">
        <form className="form" >
          <h2>Reset Password</h2>
          <div className="flex-column">
            <label>Email</label>
          </div>
          <div className="inputForm">
            <input
              placeholder="Enter your Email"
              className="input"
              type="email"
              required
            />
          </div>
          <button className="button-submit" type="submit">
            Reset Password
          </button>
        </form>
        <div className="auth-footer">
          <p>
            Powered by
            <a href="www.kantipurinfotech.com" className="kit">
              KIT
            </a>
            &nbsp;&nbsp;•&nbsp;&nbsp; ©pos, Inc. 2023. All Rights Reserved.
            &nbsp;&nbsp;• &nbsp;&nbsp;
            <a href="">Privacy Statement</a> &nbsp;&nbsp; • &nbsp;&nbsp;
            <a href="">Terms of Service</a> &nbsp;&nbsp;• &nbsp;&nbsp;
            <a href="">POS Blog</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Resetpassword
