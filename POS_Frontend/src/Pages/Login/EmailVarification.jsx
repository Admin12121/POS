import "./style.scss"; // Import styles
import { Link } from "react-router-dom";

const EmailVarification = () => (
  <div className="EmailVarification_wrapper">
    <div className="emailV_wrapper">
      <form className="form">
        <div>
          <h2>Varify your email</h2>
          <p className="para_verify">
            We've sent a link to your email ter4@example.com. <br />
            Please follow the link inside to continue
          </p>
        </div>
        <div>
          <p className="para_verify">
            Didn't receive an email?{" "}
            <Link className="resend_link">Resend Link</Link>
          </p>
        </div>
        <div>
          <button className="btn_submit">Skip Now</button>
        </div>
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

export default EmailVarification;
