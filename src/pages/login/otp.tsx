import { useEffect, useState } from "react";
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
import {
  useActiveUserMutation,
  useResendOtpMutation,
  useCheckActiveUserMutation,
} from "@/fetch_Api/service/user_Auth_Api";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Spinner from "@/components/ui/spinner"

const Otp = () => {
  const [nouser, setNouser] = useState(false);
  const [otpTime, setOtpTime] = useState(null);
  const [otpSent, setOtpSent] = useState(true);
  const [otpExpired, setOtpExpired] = useState(false);
  const [Time, setTime] = useState<any>(null);
  const [activeUser, { isLoading }] = useActiveUserMutation();
  const [resendOtp, { isLoading: isResendLoading }] = useResendOtpMutation();
  const [checkActiveUser, { isLoading: isCheckActiveLoading }] =
    useCheckActiveUserMutation();
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const { email } = useParams();

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

  const handleUSerCheck = async () => {
    const response = await checkActiveUser({ email: email });
    if (response.error) {
      if (
        (response?.error as any)?.data?.detail ===
        "No User matches the given query."
      ) {
        setNouser(true);
      } else if (
        (response?.error as any)?.data?.msg === "User is not active."
      ) {
        if ((response?.error as any)?.data?.otp_time) {
          setOtpTime((response?.error as any)?.data?.otp_time);
        } else {
          setOtpSent(false);
          setOtpExpired(false);
        }
      }
    } else if (response.data.msg === "User is active.") {
      navigate("/login");
    }
  };

  useEffect(() => {
    if (email) {
      handleUSerCheck();
    }
  }, [email]);

  const handleSubmit = async () => {
    try {
      const response = await activeUser({ email: email, otp: value });
      console.log(response);
      if (response.data) {
        toast.success(response.data.msg, {
          action: {
            label: "X",
            onClick: () => toast.dismiss(),
          },
        });
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await resendOtp({ email: email });
      if (response.data) {
        handleUSerCheck();
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

  return (
    <div className="flex justify-center items-center h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Active account</CardTitle>
          <CardDescription>Enter the code we sent to {email}</CardDescription>
        </CardHeader>
        <CardContent>
          {isCheckActiveLoading ? (
            <span className="flex justify-center items-center">
              <Spinner />
            </span>
          ) : nouser ? (
            "No user found"
          ) : (
            <>
              <div className="space-y-2 flex flex-col justify-center items-center">
                <InputOTP
                  maxLength={6}
                  value={value}
                  onChange={(value) => setValue(value)}
                  disabled={!otpSent}
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
          )}
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
                    onClick={handleResendOtp}
                  >
                    {otpSent ? "Resend" : "Send"}{" "}
                    {otpExpired && otpTime ? <p className="text-red-400">(otp has been expired)</p> : ""}
                  </span>
                )}
              </span>            
          <Button
            disabled={
              isLoading || isResendLoading || isCheckActiveLoading || nouser
            }
            loading={isLoading || isResendLoading}
            onClick={handleSubmit}
            className="w-full"
          >
            Verify & Proceed
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Otp;
