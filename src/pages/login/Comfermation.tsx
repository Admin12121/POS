import { useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";
import { useResetPasswordMutation } from "@/fetch_Api/service/user_Auth_Api";
import { toast } from 'sonner';
import zxcvbn from 'zxcvbn';
import './style.scss';
import { BsExclamationCircleFill } from "react-icons/bs";
import {  useNavigate } from "react-router-dom";

interface ServerError {
  [key: string]: string[];
}

const Comfermation = () => {
  const navigate = useNavigate();
  const [server_error, setServerError] = useState<ServerError>({});
  const [server_msg, setServerMsg] = useState<any>({});
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const { id, token } = useParams();
  const [sendPasswordResetEmail, { isLoading }] = useResetPasswordMutation();
  const prevStrength = useRef<number>(0);

  const handlePasswordChange = (e: any) => {
    const password = e.target.value;
    const result = zxcvbn(password);
    setPasswordStrength(result.score);
  };

  useEffect(() => {
    if (Object.keys(server_error).length > 0) {
      const errorKey = Object.keys(server_error)[0];
      if (server_error[errorKey] && server_error[errorKey].length > 0) {
        const errorMessage = server_error[errorKey][0];
        toast.error(errorMessage, {
          action: {
            label: 'X',
            onClick: () => toast.dismiss(),
          },
        });
      }
    }
  }, [server_error]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (passwordStrength < 3) {
      toast.error("Your password is too weak. Please choose a stronger password.");
      return;
    }

    const data = new FormData(e.currentTarget);
    const actualData = {
      password: data.get('password'),
      password2: data.get('password2'),
    };
    const res = await sendPasswordResetEmail({ actualData, id, token });
    if (res.error && 'data' in res.error && res.error.data) {
      setServerMsg({});
      setServerError((res.error.data as any).errors);
    }
    if (res.data) {
      setServerError({});
      setServerMsg(res.data);
      toast.success(res.data.msg, {
        action: {
          label: 'X',
          onClick: () => toast.dismiss(),
        },
      });
      navigate('/', { replace: true });
      const form = document.getElementById('password-reset-email-form') as HTMLFormElement;
      if (form) {
        form.reset();
      }
    }
  };

  const getBarClass = (index: number) => {
    if (passwordStrength >= index + 1) {
      if (passwordStrength > prevStrength.current) {
        return `progress ${passwordStrength === 1 ? 'bg-red-500' : passwordStrength === 2 ? 'bg-orange-500' : passwordStrength === 3 ? 'bg-orange-500' : 'bg-green-500'}`;
      } else {
        return `degrade ${passwordStrength === 1 ? 'bg-red-500' : passwordStrength === 2 ? 'bg-orange-500' : passwordStrength === 3 ? 'bg-orange-500' : 'bg-green-500'}`;
      }
    } else {
      return 'bg-gray-300';
    }
  };

  useEffect(() => {
    prevStrength.current = passwordStrength;
  }, [passwordStrength]);

  return (
    <div className="ResetPassword_wrapper">
      <div className="reset_wrapper">
        <form className="form" id='password-reset-email-form' onSubmit={handleSubmit}>
          <h2>Change Password</h2>
          <div className="flex-column">
            <label>Password</label>
          </div>
          <div className={`inputForm ${server_error.non_field_errors || server_error.password ? "border-red-500" : server_msg.msg ? "border-green-500" : ""}`}>
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
              placeholder="New Password"
              className="input"
              type="password"
              name='password'
              required
              onChange={handlePasswordChange}
            />
          </div>
            <div className='flex flex-col gap-1'>
                <div className="password-strength flex space-x-1 mt-2">
                  <div className={`h-1 flex-1 rounded-md strength-bar ${getBarClass(0)}`}></div>
                  <div className={`h-1 flex-1 rounded-md strength-bar ${getBarClass(1)}`}></div>
                  <div className={`h-1 flex-1 rounded-md strength-bar ${getBarClass(2)}`}></div>
                  <div className={`h-1 flex-1 rounded-md strength-bar ${getBarClass(3)}`}></div>
                </div>
                <p className="strength-text mt-1 text-xs items-end w-full flex justify-end gap-1">
                  {passwordStrength === 0 && "Very Weak"}
                  {passwordStrength === 1 && "Weak"}
                  {passwordStrength === 2 && "So-so"}
                  {passwordStrength === 3 && "Good"}
                  {passwordStrength === 4 && "Strong"}
                  <BsExclamationCircleFill size={14}/>
                </p>
            </div>
          <div className="flex-column !w-full">
            <label>Confirm Password</label>
          </div>
          <div className={`inputForm ${server_error.non_field_errors || server_error.password ? "border-red-500" : server_msg.msg ? "border-green-500" : ""}`}>
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
              placeholder="Confirm Password"
              className="input"
              type="password"
              name='password2'
              required
            />
          </div>
          {isLoading ? <button disabled style={{ background: '#151717f2' }} className="button-submit"><svg className="svg_loader" viewBox="25 25 50 50"><circle className="svgcircle" r="20" cy="50" cx="50"></circle></svg></button> : <button className="button-submit" type="submit">Reset Password</button>}
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
  );
}

export default Comfermation;