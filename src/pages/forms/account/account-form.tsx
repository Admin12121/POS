import { useState, useRef, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useDashboardData } from "@/pages/dashboard/Dashboard";
import { Input } from "@/components/ui/input";
import zxcvbn from "zxcvbn";
import { Label } from "@/components/ui/label";
import {
  useChangeUserPasswordMutation,
  useTwoFaMutation,
} from "@/fetch_Api/service/user_Auth_Api";
import { BsExclamationCircleFill } from "react-icons/bs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Old Password is required"),
    newPassword: z
      .string()
      .min(6, "New Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const twoFaSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

type PasswordFormData = z.infer<typeof passwordSchema>;
type TwoFaFormData = z.infer<typeof twoFaSchema>;

export function AccountForm() {
  const { userData, Refetch } = useDashboardData();
  const alertDialogCancelRef = useRef<HTMLButtonElement>(null);
  const dialogCancelRef = useRef<HTMLButtonElement>(null);
  const [TwoFaUpdate, { isLoading: isLoadingTwoFa }] = useTwoFaMutation();
  const [twofaerror, setTwoFaError] = useState<string>("");
  const [ChangePassword, { isLoading: isLoadingPassword }] =
    useChangeUserPasswordMutation();
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const prevStrength = useRef<number>(0);
  const {
    register: passwordRegister,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
    watch,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const {
    register: twoFaRegister,
    handleSubmit: handleTwoFaSubmit,
    reset: resetTwoFaForm,
  } = useForm<TwoFaFormData>({
    resolver: zodResolver(twoFaSchema),
  });

  const getBarClass = (index: number) => {
    if (passwordStrength >= index + 1) {
      if (passwordStrength > prevStrength.current) {
        return `progress ${
          passwordStrength === 1
            ? "bg-red-500"
            : passwordStrength === 2
            ? "bg-orange-500"
            : passwordStrength === 3
            ? "bg-orange-500"
            : "bg-green-500"
        }`;
      } else {
        return `degrade ${
          passwordStrength === 1
            ? "bg-red-500"
            : passwordStrength === 2
            ? "bg-orange-500"
            : passwordStrength === 3
            ? "bg-orange-500"
            : "bg-green-500"
        }`;
      }
    } else {
      return "bg-gray-300";
    }
  };

  const handleTwoFaUpdate = async (data: TwoFaFormData) => {
    setTwoFaError("");
    const res = await TwoFaUpdate({ actualData: data });
    if (res.data) {
      Refetch();
      toast.success(res.data.msg, {
        action: {
          label: "X",
          onClick: () => toast.dismiss(),
        },
      });
      alertDialogCancelRef.current?.click();
    } else if (res.error) {
      setTwoFaError((res.error as any).data.error);
      toast.error((res.error as any).data.error, {
        action: {
          label: "X",
          onClick: () => toast.dismiss(),
        },
      });
    }
  };

  const handlePasswordChange = async (data: PasswordFormData) => {
    if (passwordStrength < 3) {
      toast.error(
        "Your password is too weak. Please choose a stronger password."
      );
      return;
    }
    const res = await ChangePassword({ actualData: data });
    if (res.data) {
      toast.success(res.data.msg, {
        action: {
          label: "X",
          onClick: () => toast.dismiss(),
        },
      });
      resetPasswordForm();
      dialogCancelRef.current?.click();
    } else if (res.error) {
      const errorMessage =
        (res.error as any).data?.errors?.non_field_errors?.[0] ||
        "An error occurred";
      toast.error(errorMessage, {
        action: {
          label: "X",
          onClick: () => toast.dismiss(),
        },
      });
    }
  };

  const handleDialogOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetPasswordForm();
      setPasswordStrength(0);
    }
  };

  useEffect(() => {
    prevStrength.current = passwordStrength;
  }, [passwordStrength]);

  const newPassword = watch("newPassword");

  useEffect(() => {
    if (newPassword) {
      const result = zxcvbn(newPassword);
      setPasswordStrength(result.score);
    }
  }, [newPassword]);

  const handleTwoFaOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetTwoFaForm({
        password: "", // Reset the password field to an empty string
      });
      setTwoFaError(""); // Clear any existing errors
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="space-y-4">
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5 flex flex-col">
              <Label className="text-base">Two Factor Authentication</Label>
              <p className="text-sm text-gray-500">
                Receive emails about new products, features, and more.
              </p>
            </div>
            <span>
             <AlertDialog onOpenChange={handleTwoFaOpenChange}>
                <AlertDialogTrigger asChild>
                  <Switch
                    checked={userData?.is_enable}
                    className={`${userData?.is_enable ? "bg-green-500" : "bg-zinc-500"}`}
                    // onCheckedChange={field.onChange}
                  />
                  {/* <Button variant="outline">
                    {userData?.is_enable ? "Disable 2FA" : "Enable 2FA"}
                  </Button> */}
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {userData?.is_enable ? "Disable 2FA" : "Enable 2FA"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {userData?.is_enable
                        ? "Are you sure you want to disable 2FA?"
                        : "Are you sure you want to enable 2FA?"}
                      <div
                        className="inputForm"
                        style={{
                          border: `${twofaerror ? "1px solid red" : ""}`,
                        }}
                      >
                        <input
                          type="password"
                          className="input"
                          {...twoFaRegister("password")}
                          placeholder="Password"
                          required
                        />
                      </div>
                      {twofaerror && (
                        <span className="text-red-500">{twofaerror}</span>
                      )}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel ref={alertDialogCancelRef}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleTwoFaSubmit(handleTwoFaUpdate)}
                      loading={isLoadingTwoFa}
                    >
                      {userData?.is_enable ? "Disable" : "Enable"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>              
            </span>
          </div>
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5 flex flex-col">
              <Label className="text-base">Password</Label>
              <p className="text-sm text-gray-500">Change your password.</p>
            </div>
            <span>
              <Dialog onOpenChange={handleDialogOpenChange}>
                <DialogTrigger asChild>
                  <Button variant="outline">Change Password</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] z-[999]">
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={handlePasswordSubmit(handlePasswordChange)}
                    className="grid gap-4 py-4"
                  >
                    <div className="flex flex-col items-start gap-2">
                      <Label htmlFor="oldPassword">Old Password</Label>
                      <Input
                        id="oldPassword"
                        type="password"
                        {...passwordRegister("oldPassword")}
                        className="col-span-3"
                      />
                    </div>
                    {passwordErrors.oldPassword && (
                      <span className="text-red-500">
                        {passwordErrors.oldPassword.message}
                      </span>
                    )}
                    <div className="flex flex-col items-start gap-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        {...passwordRegister("newPassword")}
                        className="col-span-3"
                      />
                    </div>
                    {passwordErrors.newPassword && (
                      <span className="text-red-500">
                        {passwordErrors.newPassword.message}
                      </span>
                    )}
                    <div className="flex flex-col items-start gap-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...passwordRegister("confirmPassword")}
                        className="col-span-3"
                      />
                    </div>
                    {passwordErrors.confirmPassword && (
                      <span className="text-red-500">
                        {passwordErrors.confirmPassword.message}
                      </span>
                    )}
                    <div className="flex flex-col gap-1">
                      <div className="password-strength flex space-x-1 mt-2">
                        <div
                          className={`h-1 flex-1 rounded-md strength-bar ${getBarClass(
                            0
                          )}`}
                        ></div>
                        <div
                          className={`h-1 flex-1 rounded-md strength-bar ${getBarClass(
                            1
                          )}`}
                        ></div>
                        <div
                          className={`h-1 flex-1 rounded-md strength-bar ${getBarClass(
                            2
                          )}`}
                        ></div>
                        <div
                          className={`h-1 flex-1 rounded-md strength-bar ${getBarClass(
                            3
                          )}`}
                        ></div>
                      </div>
                      <p className="strength-text mt-1 text-xs items-end w-full flex justify-end gap-1">
                        {passwordStrength === 0 && "Very Weak"}
                        {passwordStrength === 1 && "Weak"}
                        {passwordStrength === 2 && "So-so"}
                        {passwordStrength === 3 && "Good"}
                        {passwordStrength === 4 && "Strong"}
                        <BsExclamationCircleFill size={14} />
                      </p>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          ref={dialogCancelRef}
                          type="button"
                          variant="secondary"
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type="submit" loading={isLoadingPassword}>
                        Change Password
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </span>
          </div>
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5 flex flex-col">
              <Label className="text-base">Delete Account</Label>
              <p className="text-sm text-gray-500">Delete your account.</p>
            </div>
            <span>
              <Button variant="destructive">Delete Account</Button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
