import  {useState,useEffect} from 'react'
import { useSendPasswordResetEmailMutation,  useResendOtpMutation, useResetPasswordMutation } from "@/fetch_Api/service/user_Auth_Api";
import {toast } from 'sonner';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Comfermation from './Comfermation'
import './style.scss'


const Resetpassword = () => {
  const [sendPasswordResetEmail, { isLoading }] = useSendPasswordResetEmailMutation();

  const [resendOtp, { isLoading: isResendLoading }] = useResendOtpMutation();
  const [resetPassword, { isLoading: isResetLoading }] = useResetPasswordMutation();
  const [otpTime, setOtpTime] = useState<any>(null);
  const [otpUser, setOtpUser] = useState<any>(null);
  const [otpExpired, setOtpExpired] = useState(false);
  const [Time, setTime] = useState<any>(null);
  const [value, setValue] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  useEffect(() => {
    if (otpTime) {
      const interval = setInterval(() => {
        const now = new Date();
        const otpDate = new Date(otpTime);
        const timeDifference =
          otpDate.getTime() + 2 * 60 * 1000 - now.getTime();

        if (timeDifference > 0) {
          const minutes = Math.floor(
            (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
          setTime({ minutes, seconds });
        } else {
          clearInterval(interval);
          setOtpExpired(true);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [otpTime]);

  const handleResendOtp = async (email: string) => {
    try {
      const response = await resendOtp({ email: email });
      if (response.data) {
          setOtpSent(true);
          setOtpTime((response.data as any).otp_time);
          setOtpExpired(false);
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
      email: data.get('email'),
    }
    const res = await sendPasswordResetEmail(actualData)
    if (res.error) {
      console.log(res.error)
        toast.error((res.error as any).data.detail, {
          action: {
            label: 'X',
            onClick: () => toast.dismiss(),
          },} );
    }
    if (res.data) {
      toast.success(res.data.msg, {
        action: {
          label: 'X',
          onClick: () => toast.dismiss(),
        },} );
      setOtpUser((res.data as any).email)
      setOtpTime((res.data as any).otp_time)
      const form = document.getElementById('password-reset-email-form') as HTMLFormElement;
      if (form) {
        form.reset();
      }
    }
  }

  const handleOtpSubmit = async (e:any) => {
    e.preventDefault();
    if (value.length !== 6) {
      toast.error("OTP is Invalid", {
        action: {
          label: "X",
          onClick: () => toast.dismiss(),
        },
      });
      return;
    }    
    const actualData = {
      email: otpUser,
      otp: value,
    }
    const res = await resetPassword({actualData})
    if (res.error) {
      toast.error((res.error as any).data.errors.otp[0], {
        action: {
          label: 'X',
          onClick: () => toast.dismiss(),
        },} );
    }
    if (res.data) {
      if(res.data.msg){
        setOtpVerified(true)
        toast.success(res.data.msg, {
          action: {
            label: 'X',
            onClick: () => toast.dismiss(),
          },} );
      }
    }    
  }
  
  return (
    <div className="ResetPassword_wrapper">
      {otpUser ? otpVerified ? <Comfermation email={otpUser}/> : (
        <OTP
          isResendLoading={isResendLoading}
          handleSubmit={handleOtpSubmit}
          isResetLoading={isResetLoading}
          otpTime={otpTime}
          otpSent={otpSent}
          user={otpUser}
          value={value}
          setValue={setValue}
          Time={Time}
          handleResendOtp={handleResendOtp}
          otpExpired={otpExpired}
        />
      ) : ( <div className="reset_wrapper">
              <form className="form" id='password-reset-email-form' onSubmit={handleSubmit}>
                <h2>Reset Password</h2>
                <div className="flex-column">
                  <label>Email</label>
                </div>
                <div className="inputForm">
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
                {isLoading ? <button disabled style={{background:'#151717f2'}} className="button-submit flex justify-center items-center"><svg className="svg_loader" viewBox="25 25 50 50"><circle className="svgcircle" r="20" cy="50" cx="50"></circle></svg></button> :<button className="button-submit" type="submit">Reset Password</button>}
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
            </div>)}
    </div>
  )
}

const OTP = ({
  isResendLoading,
  handleSubmit,
  isResetLoading,
  otpTime,
  user,
  value,
  setValue,
  otpExpired,
  Time,
  handleResendOtp,
  otpSent,
}: {
  isResendLoading: boolean;
  isResetLoading: boolean;
  handleSubmit: any;
  otpTime: any;
  user: any;
  value: any;
  setValue: any;
  otpExpired: any;
  Time: any;
  handleResendOtp: any;
  otpSent: any;
}) => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Active account</CardTitle>
            <CardDescription>Enter the code we sent to {user}</CardDescription>
          </CardHeader>
          <CardContent>
            <>
              <div className="space-y-2 flex flex-col justify-center items-center">
                <InputOTP
                  maxLength={6}
                  value={value}
                  onChange={(value) => setValue(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </>
          </CardContent>
          <CardFooter className="flex w-full flex-col gap-2">
            <span className="text-center text-sm text-zinc-500">
              Didn't receive the code?{" "}
              {!otpExpired ? (
                <span className="text-center text-sm text-orange-500">
                  {Time
                    ? `${Time.minutes}:${Time.seconds < 10 ? "0" : ""}${
                        Time.seconds
                      }`
                    : "00:00"}
                </span>
              ) : (
                <span
                  className="text-orange-500 cursor-pointer"
                  onClick={() => handleResendOtp(user as string)}
                >
                  {otpSent ? "Resend" : "Send"}{" "}
                  {otpExpired && otpTime ? (
                    <p className="text-red-400">(otp has been expired)</p>
                  ) : (
                    ""
                  )}
                </span>
              )}
            </span>
            <Button
              disabled={isResendLoading || otpExpired}
              type="submit"
              className="w-full"
              loading={isResetLoading || isResendLoading}
            >Login</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};



export default Resetpassword
