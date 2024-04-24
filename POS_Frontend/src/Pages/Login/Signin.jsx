import React,{useState, useEffect} from "react";
import { useRegisterAdminMutation } from '../../Fetch_Api/Service/User_Auth_Api'
import {toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';
import "./style.scss";
const Signin = () => {
  const [server_error, setServerError] = useState({});
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterAdminMutation();
  useEffect(() => {
    // Check if server_error is not empty and it has at least one key
    if (Object.keys(server_error).length > 0) {
      // Get the first key from the server_error object
      const errorKey = Object.keys(server_error)[0];

      // Check if the errorKey exists in server_error and it has at least one message
      if (server_error[errorKey] && server_error[errorKey].length > 0) {
        const errorMessage = server_error[errorKey][0];

        // Display the toast notification
        toast.error(errorMessage, {
          action: {
            label: 'X',
            onClick: () => toast.dismiss(),
          },}  );
      }
    }
  }, [server_error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData = {
      first_name: data.get("first_name"),
      last_name: data.get("last_name"),
      email: data.get("email"),
      phone: data.get("phone"),
      password: data.get("password"),
      password2: data.get("password2"),
      tc: data.get("tc"),
    };
    const res = await registerUser(actualData);
    if (res.error) {
      setServerError(res.error.data.errors);
    }
    if (res.data) {
      toast.success(res.data.msg, {
        action: {
          label: 'X',
          onClick: () => toast.dismiss(),
        },} );
      navigate("/");
    }
  };
  return (
    <div className="Login_wrapper">
      <div className="image_wrapper">
        <div className="overlay">
          <div className="main_over"></div>
          <img src="1.jpg" alt="" />
          <div className="carousel-caption">
              <div className="top-bar"></div>
              <h5>Get the most from RestroNepal</h5>
              <p>Exciting product updates coming this fall.</p>
                <a href="">Learn More</a>
          </div>
        </div>
          <div className="auth-footer">
              <div className="footer-top-bar"></div>
              <p>Powered by <a href="https://kantipurinfotech.com/" target="_bank" className="kit">KIT</a> &nbsp;&nbsp;•&nbsp;&nbsp; ©pos, Inc. 2023. All Rights Reserved. &nbsp;&nbsp;• &nbsp;&nbsp;<a href="">Privacy Statement</a> &nbsp;&nbsp; • &nbsp;&nbsp;<a href="">Terms of Service</a>  &nbsp;&nbsp;• &nbsp;&nbsp;<a href="">POS Blog</a></p>
          </div>
      </div>
      <div className="login_wrapper">
        <form className="form" onSubmit={handleSubmit}>
          <span className="Logo">
            <img src="https://kantipurinfotech.com/wp-content/themes/kantipurinfotech/assets/images/kit-logo.svg" alt="" />
          <p className="p"> Register to Your Account</p>
          </span>
          <div className="flex-row">
            <div className="flex-column" style={{width:"47%"}}>
              <label>First Name </label>
            <div className="inputForm" style={{border: `${ server_error.non_field_errors ? "1px solid Red" :""}`}}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                viewBox="0 0 32 32"
                height="20"
              >
                <g data-name="Layer 3" id="Layer_3">
                  <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path>
                </g>
              </svg>
              <input
                placeholder="First Name"
                className="input"
                name="first_name"
                type="text"
              />
            </div>
            </div>
            <div className="flex-column" style={{width:"47%"}} >
              <label>Last Name </label>
            <div className="inputForm" style={{border: `${ server_error.non_field_errors ? "1px solid Red" :""}`}}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                viewBox="0 0 32 32"
                height="20"
              >
                <g data-name="Layer 3" id="Layer_3">
                  <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path>
                </g>
              </svg>
              <input
                placeholder="Last Name"
                className="input"
                name="last_name"
                type="text"
              />
            </div>
            </div>
          </div>
          <div className="flex-column">
            <label>Email </label>
          </div>
          <div className="inputForm" style={{border: `${ server_error.non_field_errors || server_error.email ? "1px solid Red" :""}`}}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              viewBox="0 0 32 32"
              height="20"
            >
              <g data-name="Layer 3" id="Layer_3">
                <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path>
              </g>
            </svg>
            <input
              placeholder="Enter your Email"
              className="input"
              name="email"
              type="text"
            />
          </div>
          <div className="flex-column">
            <label>Phone Number </label>
          </div>
          <div className="inputForm"style={{border: `${ server_error.non_field_errors || server_error.phone ? "1px solid Red" :""}`}}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              viewBox="0 0 32 32"
              height="20"
            >
              <g data-name="Layer 3" id="Layer_3">
                <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path>
              </g>
            </svg>
            <input
              placeholder="+977 XXXXXXXXXX"
              className="input"
              type="text"
              name="phone"
            />
          </div>
          <div className="flex-row">
          <div className="flex-column" style={{width:"47%"}}>
            <label>Password </label>
          <div className="inputForm" style={{border: `${ server_error.non_field_errors || server_error.password  ? "1px solid Red" :""}`}}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              viewBox="-64 0 512 512"
              height="20"
            >
              <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path>
              <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path>
            </svg>
            <input
              placeholder="Enter Your Password"
              className="input"
              name="password"
              type="password"
            />
          </div>
          </div>
          <div className="flex-column" style={{width:"47%"}}>
            <label>Comfirm Password </label>
          <div className="inputForm" style={{border: `${ server_error.non_field_errors || server_error.password2  ? "1px solid Red" :""}`}}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              viewBox="-64 0 512 512"
              height="20"
            >
              <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path>
              <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path>
            </svg>
            <input
              placeholder="Comfirm Your Password"
              className="input"
              name="password2"
              type="password"
            />
          </div>
          </div>

          </div>

          <div className="flex-row">
            <div className="content">
              <label className="checkBox" style={{boxShadow: `${ server_error.non_field_errors || server_error.tc  ? "0px 0px 0px 1px rgb(255 0 0 / 68%)" :""}`}}>
                <input id="ch1" name="tc" type="checkbox" />
                <div className="transition"></div>
              </label>
              <label>Agree with <Link to="/">Terms and Conditions</Link></label>
            </div>
          </div>
          {<p className={`p line`}>{server_error.non_field_errors || server_error.password || server_error.email || server_error.name }</p>}
          {isLoading ? <button disabled style={{background:'#151717f2'}} className="button-submit"><svg className="svg_loader" viewBox="25 25 50 50"><circle className="svgcircle" r="20" cy="50" cx="50"></circle></svg></button> : <button className="button-submit">Sign In</button>}
          <p className="p line">Or With</p>
          <div className="flex-row">
            <button className="btn google">
              <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24" height="24" viewBox="-0.5 0 48 48" version="1.1">
                  <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                      <g id="Color-" transform="translate(-401.000000, -860.000000)">
                          <g id="Google" transform="translate(401.000000, 860.000000)">
                              <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05"></path>
                              <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335"></path>
                              <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853"></path>
                              <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4"></path>
                          </g>
                      </g>
                  </g>
              </svg>  
              Continue with Google
            </button>
          </div>
          <p className="p">
            Already have an account? <Link to="/login" className="span">SignIn</Link>
          </p>
        </form>
        <div className="auth-footer">
              <p>Powered by <a href="https://www.kantipurinfotech.com" target="_bank" className="kit">KIT</a> &nbsp;&nbsp;•&nbsp;&nbsp; ©pos, Inc. 2023. All Rights Reserved. &nbsp;&nbsp;• &nbsp;&nbsp;<a href="">Privacy Statement</a> &nbsp;&nbsp; • &nbsp;&nbsp;<a href="">Terms of Service</a>  &nbsp;&nbsp;• &nbsp;&nbsp;<a href="">POS Blog</a></p>
          </div>
      </div>
    </div>
  )
}

export default Signin
