import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./style.scss";
import { useNavigate,Link } from "react-router-dom";
import { setUserToken } from "@/fetch_Api/feature/authSlice";
import {
  getToken, 
  storeToken,
} from "@/fetch_Api/service/localStorageServices";
import { useLoginUserMutation , useResendOtpMutation} from "@/fetch_Api/service/user_Auth_Api";
import {toast } from 'sonner';
import Spinner from "@/components/ui/spinner";

interface ServerError {
  [key: string]: string[];
}

const Login = () => {
  const [server_error, setServerError] = useState<ServerError>({});
  const navigate = useNavigate();
  const [loginUser] = useLoginUserMutation();
  const dispatch = useDispatch();
  const [resendOtp, { isLoading: isResendLoading }] = useResendOtpMutation();

  useEffect(() => {
    if (Object.keys(server_error).length > 0) {
      const errorKey = Object.keys(server_error)[0];
      if (server_error[errorKey] && server_error[errorKey].length > 0) {
        const errorMessage = server_error[errorKey][0];
        toast.error(errorMessage, {
          action: {
            label: 'X',
            onClick: () => toast.dismiss(),
          },} );
      }
    }
  }, [server_error]);

  const handleResendOtp = async (email:string) => {
    try {
      const response = await resendOtp({ email: email });
      if (response.data) {
        navigate(`/accounts/activate/${email}`);
      }
      if (response.error) {
        toast.error((response.error as any).data.msg, {
          action: {
            label: "X",
            onClick: () => toast.dismiss(),
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };


  const handleSubmit = async (e:any) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData = {
      email_or_username: data.get("email_or_username"),
      password: data.get("password"),
    };
    const res = await loginUser(actualData);
    if (res.error && 'data' in res.error && res.error.data) {
      setServerError((res.error.data as any).errors);
      if((res.error.data as any)?.errors?.user[0] === "Please Active your Account"){
        toast.info("Please Active your Account", {
          action: {
            label: 'X',
            onClick: () => toast.dismiss(),
          },} );
        handleResendOtp(actualData.email_or_username as string);
      }
    }
    if (res.data) {
      storeToken(res.data.token);
      let { access_token } = getToken();
      dispatch(setUserToken({ access_token: access_token }));
      toast.success(res.data.msg, {
        action: {
          label: 'X',
          onClick: () => toast.dismiss(),
        },} );
        navigate('/', { replace: true });
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
        <form action="#" className="form" onSubmit={handleSubmit}>
          <span className="Logo">
            <img src="https://kantipurinfotech.com/wp-content/themes/kantipurinfotech/assets/images/kit-logo.svg" alt="" />
          <p className="p"> Login to your account</p>
          </span>
          <div className="flex-column" style={{width:"100%"}}>
            <label>Email or User Name</label>
          </div>
          <div className="inputForm" style={{border: `${ server_error && server_error.non_field_errors ||server_error && server_error.email ? "1px solid Red" :""}`}}>
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
              placeholder="Email or User Name"
              className="input"
              type="text"
              name="email_or_username"
              required
            />
          </div>

          <div className="flex-column">
            <label>Password </label>
          </div>
          <div className="inputForm" style={{border: `${server_error && server_error.non_field_errors ||server_error && server_error.password ? "1px solid Red" :""}`}}>
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
              placeholder="Password"
              className="input"
              type="password"
              name="password"
              autoComplete="new-password"
              required
            />
          </div>

          <div className="flex-row" style={{justifyContent:"end"}}>

            <Link to="/forgot-password" className="span">Forgot password?</Link>
          </div>
          <button className="button-submit flex items-center justify-center"  disabled={isResendLoading}>{isResendLoading ? <Spinner/> : "Sign In"}</button>
          <p className="p">
            Don't have an account? <Link to="/signin" className="span">Sign Up</Link>
          </p>
        </form>
        <div className="auth-footer">
              <p>Powered by <a href="https://kantipurinfotech.com/" target="_bank" className="kit">KIT</a> &nbsp;&nbsp;•&nbsp;&nbsp; ©pos, Inc. 2023. All Rights Reserved. &nbsp;&nbsp;• &nbsp;&nbsp;<a href="">Privacy Statement</a> &nbsp;&nbsp; • &nbsp;&nbsp;<a href="">Terms of Service</a>  &nbsp;&nbsp;• &nbsp;&nbsp;<a href="">POS Blog</a></p>
          </div>
      </div>
    </div>
  );
};

export default Login;
