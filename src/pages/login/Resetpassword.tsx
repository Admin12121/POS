import  {useState,useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import { useSendPasswordResetEmailMutation } from "@/fetch_Api/service/user_Auth_Api";
import {toast } from 'sonner';
import './style.scss'

interface ServerError {
  [key: string]: string[];
}


const Resetpassword = () => {
  const [server_error, setServerError] = useState<ServerError>({})
  const [server_msg, setServerMsg] = useState<any>({})
  const [sendPasswordResetEmail, { isLoading }] = useSendPasswordResetEmailMutation();
  const navigate = useNavigate();
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
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData = {
      email: data.get('email'),
    }
    const res = await sendPasswordResetEmail(actualData)
    if (res.error && 'data' in res.error && res.error.data) {
      setServerMsg({})
      setServerError((res.error?.data as any).errors)
    }
    if (res.data) {
      setServerError({})
      setServerMsg(res.data)
      toast.success(res.data.msg, {
        action: {
          label: 'X',
          onClick: () => toast.dismiss(),
        },} );
      const form = document.getElementById('password-reset-email-form') as HTMLFormElement;
      if (form) {
        form.reset();
      }
      navigate('/', { replace: true });
    }
  }
  return (
    <div className="ResetPassword_wrapper">
      <div className="reset_wrapper">
        <form className="form" id='password-reset-email-form' onSubmit={handleSubmit}>
          <h2>Reset Password</h2>
          <div className="flex-column">
            <label>Email</label>
          </div>
          <div className="inputForm" style={{border: `${ server_error.non_field_errors || server_error.email ?  "1px solid red": server_msg.msg ? "1px solid green" :""}`}}>
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
              type="email"
              name='email'
              required
            />
          </div>
          {isLoading ? <button disabled style={{background:'#151717f2'}} className="button-submit"><svg className="svg_loader" viewBox="25 25 50 50"><circle className="svgcircle" r="20" cy="50" cx="50"></circle></svg></button> :<button className="button-submit" type="submit">Reset Password</button>}
        </form>
        <div className="auth-footer">
          <p>
            Powered by
            <a href="https://kantipurinfotech.com/" target="_bank" className="kit">
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
