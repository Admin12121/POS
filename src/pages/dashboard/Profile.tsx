import { useState, useEffect, useCallback, useRef } from "react";
import { useDashboardData } from "@/pages/dashboard/Dashboard";
import {
  useUpdateUserProfileMutation,
  useChangeUserPasswordMutation,
  useTwoFaMutation,
} from "@/fetch_Api/service/user_Auth_Api";
import { toast } from "sonner";
import "./style.scss";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import zxcvbn from "zxcvbn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MdOutlineEdit } from "react-icons/md";
import { IoCloudUploadOutline } from "react-icons/io5";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: number;
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  phone: string;
  profile: string;
  is_enable: boolean;
  gender: string;
  dob: string;
}

const profileSchema = z.object({
  first_name: z.string().min(1, "First Name is required"),
  last_name: z.string().min(1, "Last Name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  name: z.string().min(1, "Username is required"),
  gender: z.string().min(1, "Gender is required"),
  dob: z.string().min(1, "Date of Birth is required"),
});

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

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;
type TwoFaFormData = z.infer<typeof twoFaSchema>;

const UserProfile = () => {
  const { userData, Refetch } = useDashboardData();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [User, setUser] = useState<User | null>(null);
  const [first_last, setFirstLast] = useState({ first: "", last: "" });
  const [previewImage, setPreviewImage] = useState("");
  const [logfile, setLogFile] = useState<File | null>(null);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [UpdateProfile, { isLoading: isLoadingProfile }] =
    useUpdateUserProfileMutation();
  const [ChangePassword, { isLoading: isLoadingPassword }] =
    useChangeUserPasswordMutation();
  const [TwoFaUpdate, { isLoading: isLoadingTwoFa }] = useTwoFaMutation();
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const prevStrength = useRef<number>(0);
  const [twofaerror, setTwoFaError] = useState<string>("");
  const alertDialogCancelRef = useRef<HTMLButtonElement>(null);
  const dialogCancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (userData) {
      setUser(userData);
      setFirstLast({ first: userData.first_name, last: userData.last_name });
    }
  }, [userData]);

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setUser((prevData: any) => ({
      ...prevData,
      [name]: newValue,
    }));
    setIsFormChanged(true);
  };

  const {
    register: profileRegister,
    handleSubmit: handleProfileSubmit,
    reset: resetProfileForm,
    formState: { errors: profileErrors },
    control: profileControl,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

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

  useEffect(() => {
    if (userData) {
      setUser(userData);
      setFirstLast({ first: userData.first_name, last: userData.last_name });
      resetProfileForm({
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
        name: userData.name,
        gender: userData.gender,
        dob: userData.dob,
      });
      setIsFormChanged(false);
    }
  }, [userData, resetProfileForm]);

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

  const handleProfileUpdate = async (data: ProfileFormData) => {
    if (User) {
      let id = User.id;
      const NewFormData = new FormData();
      NewFormData.append("name", data.name);
      NewFormData.append("first_name", data.first_name);
      NewFormData.append("last_name", data.last_name);
      NewFormData.append("phone", data.phone);
      NewFormData.append("gender", data.gender);
      NewFormData.append("dob", data.dob);
      if (logfile) {
        NewFormData.append("profile", logfile);
      }
      const res = await UpdateProfile({ NewFormData, id });
      if (res.data) {
        setPreviewImage("");
        setLogFile(null);
        toast.success(res.data.msg, {
          action: {
            label: "X",
            onClick: () => toast.dismiss(),
          },
        });
        setIsFormChanged(false);
      } else {
        console.log(res.error);
      }
    }
  };

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

  const handleCancel = () => {
    setIsEditingProfile(false);
    setPreviewImage("");
    setLogFile(null);
    if (userData) {
      resetProfileForm({
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
        name: userData.name,
      });
      setIsFormChanged(false);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (isEditingProfile) {
        const file = acceptedFiles[0];
        setLogFile(file);
        setPreviewImage(URL.createObjectURL(file));
        setIsFormChanged(true);
      }
    },
    [isEditingProfile]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    noClick: !isEditingProfile,
  });

  const handleDialogOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetPasswordForm(); // Clear the form on close
    }
  };

  const handleTwoFaOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetTwoFaForm({
        password: "", // Reset the password field to an empty string
      });
      setTwoFaError(""); // Clear any existing errors
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

  return (
    <>
      <div className="wrapper">
        <div className="header_wrapper_">
          <h1>Profile</h1>
          <p>User Profile</p>
        </div>
        <form
          className="form_wrapper"
          onSubmit={handleProfileSubmit(handleProfileUpdate)}
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="profile-picture_" {...getRootProps()}>
                <input {...getInputProps()} />
                <span className="user_details">
                  <Avatar className="!w-20 !h-20 !border-primary">
                    <AvatarImage
                      className="!w-full !h-full !relative"
                      src={previewImage || (userData && User && User.profile)}
                      alt={`@${userData && User && User.name}`}
                    />
                    <AvatarFallback>
                      {userData && User && `${User.first_name.charAt(0)}${User.last_name.charAt(0).toUpperCase()}`}
                    </AvatarFallback>
                  </Avatar>
                  {isEditingProfile ? (
                    <IoCloudUploadOutline
                      size={20}
                      className="absolute bottom-0 left-16"
                    />
                  ) : (
                    <MdOutlineEdit
                      size={20}
                      className="absolute bottom-0 left-16"
                      onClick={() => setIsEditingProfile(true)}
                    />
                  )}
                  <span className="profile_text_">
                    <h2 className="text-sm font-bold">
                      {userData &&
                        User &&
                        first_last.first + " " + first_last.last}
                    </h2>
                    <p>Updates Your Photo and Personal Details</p>
                  </span>
                </span>
              </div>
            </AlertDialogTrigger>
            {!isEditingProfile && (
              <AlertDialogContent className="w-[300px]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Current Profile</AlertDialogTitle>
                  <AlertDialogDescription className="flex justify-center items-center">
                    <Avatar className="!w-20 !h-20 !border-primary">
                      <AvatarImage
                        className="!w-full !h-full !relative object-cover"
                        src={previewImage || (userData && User && User.profile)}
                        alt={`@${userData && User && User.name}`}
                      />
                      <AvatarFallback>
                        {userData &&
                          User &&
                          `${User.first_name.charAt(0)}${User.last_name.charAt(
                            0
                          )}`}
                      </AvatarFallback>
                    </Avatar>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Close</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            )}
          </AlertDialog>
          <div className="form-wrapper">
            <div className="flex-row">
              <div className="flex-column">
                <label>First Name:</label>
                <div className="inputForm">
                  <input
                    type="text"
                    className="input"
                    {...profileRegister("first_name")}
                    placeholder="First Name"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {profileErrors.first_name && (
                  <span className="text-red-500">
                    {profileErrors.first_name.message}
                  </span>
                )}
              </div>
              <div className="flex-column">
                <label>Last Name:</label>
                <div className="inputForm">
                  <input
                    type="text"
                    className="input"
                    {...profileRegister("last_name")}
                    placeholder="Last Name"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {profileErrors.last_name && (
                  <span className="text-red-500">
                    {profileErrors.last_name.message}
                  </span>
                )}
              </div>
              <div className="flex-column">
                <label>Email:</label>
                <div className="inputForm">
                  <input
                    type="email"
                    className="input"
                    name="email"
                    disabled
                    value={userData && User && User?.email}
                    placeholder="Email"
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="flex-column">
                <label>Phone:</label>
                <div className="inputForm">
                  <input
                    type="number"
                    className="input"
                    {...profileRegister("phone")}
                    placeholder="Phone"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {profileErrors.phone && (
                  <span className="text-red-500">
                    {profileErrors.phone.message}
                  </span>
                )}
              </div>
              <div className="flex-column">
                <label>Username:</label>
                <div className="inputForm">
                  <input
                    type="text"
                    className="input"
                    {...profileRegister("name")}
                    placeholder="Username"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {profileErrors.name && (
                  <span className="text-red-500">
                    {profileErrors.name.message}
                  </span>
                )}
              </div>
              <div className="flex-column">
                <label>Gender:</label>
                <Controller
                  name="gender"
                  control={profileControl}
                  defaultValue={User?.gender || ""}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full !bg-white !text-neutral-800">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Gender</SelectLabel>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                {profileErrors.gender && (
                  <span className="text-red-500">
                    {profileErrors.gender.message}
                  </span>
                )}
              </div>
              <div className="flex-column">
                <label>Date of Birth:</label>
                <div className="inputForm">
                  <input
                    type="date"
                    className="input"
                    {...profileRegister("dob")}
                    placeholder="Date of Birth"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                {profileErrors.dob && (
                  <span className="text-red-500">
                    {profileErrors.dob.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-row" style={{ padding: "20px 5px" }}>
              <AlertDialog onOpenChange={handleTwoFaOpenChange}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">
                    {User?.is_enable ? "Disable 2FA" : "Enable 2FA"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {User?.is_enable ? "Disable 2FA" : "Enable 2FA"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {User?.is_enable
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
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      {twofaerror && (
                        <span className="text-red-500">{twofaerror}</span>
                      )}
                      {profileErrors.first_name && (
                        <span className="text-red-500">
                          {profileErrors.first_name.message}
                        </span>
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
                      {User?.is_enable ? "Disable" : "Enable"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button
                loading={isLoadingProfile}
                type="submit"
                disabled={!isFormChanged}
              >
                Submit
              </Button>
              <span className="cursor-pointer" onClick={handleCancel}>
                Cancel
              </span>
            </div>
          </div>
        </form>
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
      </div>
    </>
  );
};

export default UserProfile;
