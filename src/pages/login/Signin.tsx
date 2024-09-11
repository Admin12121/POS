import { useState, useEffect, useRef } from "react";
import { useRegisterAdminMutation } from "@/fetch_Api/service/user_Auth_Api";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import "./style.scss";
import zxcvbn from 'zxcvbn';
import { BsExclamationCircleFill } from "react-icons/bs";
import Spinner from "@/components/ui/spinner";

interface ServerError {
  [key: string]: string[];
}

const Signin = () => {
  const [server_error, setServerError] = useState<ServerError>({});
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterAdminMutation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [newPassword, setNewPassword] = useState("");
  const prevStrength = useRef<number>(0);

  const isValidUserName = (
    userName?: string,
    firstName?: string,
    lastName?: string
  ) => {
    const regex = /^[a-zA-Z0-9@#]+$/;
    const lowerCaseUserName = userName ? userName.toLowerCase() : "";
    const lowerCaseFirstName = firstName ? firstName.toLowerCase() : "";
    const lowerCaseLastName = lastName ? lastName.toLowerCase() : "";

    if (lowerCaseFirstName || lowerCaseLastName) {
      if (
        lowerCaseUserName.includes(lowerCaseFirstName) ||
        lowerCaseUserName.includes(lowerCaseLastName)
      ) {
        return false;
      }
    }

    return regex.test(userName || "");
  };

  useEffect(() => {
    updateUserName();
  }, [firstName, lastName]);

  const handleFirstNameChange = (e: any) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e: any) => {
    setLastName(e.target.value);
  };

  const handleUserNameChange = (e: any) => {
    setUserName(e.target.value.toLowerCase());
    isValidUserName(userName);
  };

  const updateUserName = () => {
    // Generate user name based on first name and last name only if userName is not provided by the user
    if (firstName !== "" || userName !== "") {
      const generatedUserName = generateUserName(firstName, lastName);
      setUserName(generatedUserName);
      isValidUserName(userName);
    }
  };

  const generateUserName = (firstName: string, lastName: string) => {
    const baseUserName = firstName.toLowerCase() + lastName.toLowerCase();
    const randomNumbers = Math.floor(Math.random() * 999); // Generate random numbers (0-9)
    const specialCharacter = Math.random() < 0.5 ? "@" : "#"; // Randomly choose @ or #
    return baseUserName + randomNumbers.toString() + specialCharacter;
  };

  useEffect(() => {
    if (Object.keys(server_error).length > 0) {
      const errorKey = Object.keys(server_error)[0];
      if (server_error[errorKey] && server_error[errorKey].length > 0) {
        const errorMessage = server_error[errorKey][0];
        toast.error(errorMessage, {
          action: {
            label: "X",
            onClick: () => toast.dismiss(),
          },
        });
      }
    }
  }, [server_error]);

  const handleSubmit = async (e: any) => {
    if (passwordStrength < 3) {
      toast.error("Your password is too weak. Please choose a stronger password.");
      return;
    }        
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const firstName = data.get("first_name");
    const lastName = data.get("last_name");
    const email = data.get("email");
    const name = userName;
    const phone = data.get("phone");
    const password = data.get("password");
    const password2 = data.get("password2");
    const tc = data.get("tc");

    if (!isValidUserName(userName)) {
      setServerError({
        name: ["Enter valid username"],
      });
      return;
    }

    if (phone && /[^\d]/.test(String(phone))) {
      setServerError({
        phone: ["Phone Number should not contain any characters"],
      });
      return;
    }
    if (!/^\d{10}$/.test(String(phone))) {
      setServerError({
        phone: ["Please enter a valid 10-digit phone number"],
      });
      return;
    }

    if (
      typeof phone === "string" &&
      !phone.startsWith("98") &&
      !phone.startsWith("97") &&
      !phone.startsWith("96")
    ) {
      setServerError({
        phone: ["Please enter a valid phone number"],
      });
      return;
    }
    // Client-side validation for password length
    if (password && typeof password === "string" && password.length < 8) {
      setServerError({
        password: ["Password must be at least 8 characters long"],
      });
      return;
    }

    const lowerCasePassword =
      typeof password === "string" ? password.toLowerCase() : ""; // Convert password to lowercase
    const lowerCaseFirstName =
      typeof firstName === "string" ? firstName.toLowerCase() : "";
    const lowerCaseLastName =
      typeof lastName === "string" ? lastName.toLowerCase() : "";
    const lowerCaseEmail = typeof email === "string" ? email.toLowerCase() : "";

    if (
      lowerCasePassword.includes(lowerCaseFirstName) ||
      lowerCasePassword.includes(lowerCaseLastName) ||
      lowerCasePassword.includes(lowerCaseEmail)
    ) {
      setServerError({
        password: [
          "Password must not contain your first name, last name, or email",
        ],
      });
      return;
    }

    if (password !== password2) {
      setServerError({
        password2: ["Passwords do not match"],
      });
      return;
    }

    const actualData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      name: name,
      phone: phone,
      password: password,
      password2: password2,
      tc: tc,
    };

    const res = await registerUser(actualData);
    if (res.error && "data" in res.error && res.error.data) {
      setServerError((res.error.data as any).errors);
    }
    if (res.data) {
      toast.success(res.data.msg, {
        action: {
          label: "X",
          onClick: () => toast.dismiss(),
        },
      });
      navigate(`/accounts/activate/${email}`);
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
    if (newPassword) {
      const result = zxcvbn(newPassword);
      setPasswordStrength(result.score);
    }
  }, [newPassword]);

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
          <p>
            Powered by{" "}
            <a
              href="https://kantipurinfotech.com/"
              target="_bank"
              className="kit"
            >
              KIT
            </a>{" "}
            &nbsp;&nbsp;•&nbsp;&nbsp; ©pos, Inc. 2023. All Rights Reserved.
            &nbsp;&nbsp;• &nbsp;&nbsp;<a href="">Privacy Statement</a>{" "}
            &nbsp;&nbsp; • &nbsp;&nbsp;<a href="">Terms of Service</a>{" "}
            &nbsp;&nbsp;• &nbsp;&nbsp;<a href="">POS Blog</a>
          </p>
        </div>
      </div>
      <div className="login_wrapper">
        <form className="form" onSubmit={handleSubmit}>
          <span className="Logo">
            <img
              src="https://kantipurinfotech.com/wp-content/themes/kantipurinfotech/assets/images/kit-logo.svg"
              alt=""
            />
            <p className="p"> Register to Your Account</p>
          </span>
          <div className="flex-row">
            <div className="flex-column" style={{ width: "47%", padding: "0" }}>
              <label>First Name </label>
              <div
                className="inputForm"
                style={{
                  border: `${
                    server_error.non_field_errors ? "1px solid Red" : ""
                  }`,
                }}
              >
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
                  onChange={handleFirstNameChange}
                  required
                />
              </div>
            </div>
            <div className="flex-column" style={{ width: "47%", padding: "0" }}>
              <label>Last Name </label>
              <div
                className="inputForm"
                style={{
                  border: `${
                    server_error.non_field_errors ? "1px solid Red" : ""
                  }`,
                }}
              >
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
                  onChange={handleLastNameChange}
                  required
                />
              </div>
            </div>
          </div>
          <div className="flex-column">
            <label>User Name </label>
          </div>
          <div
            className="inputForm"
            style={{
              border: `${
                server_error.non_field_errors || server_error.name
                  ? "1px solid Red"
                  : ""
              }`,
            }}
          >
            <svg
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <g
                id="Iconly/Light-Outline/Profile"
                stroke="none"
                stroke-width="1"
                fill="none"
                fill-rule="evenodd"
              >
                <g
                  id="Profile"
                  transform="translate(4.000000, 2.000000)"
                  fill="#000000"
                >
                  <path
                    d="M15.8399,16.1931 C15.8399,19.4891 11.3199,19.8701 7.9209,19.8701 L7.67766371,19.8698897 C5.51210414,19.8646311 -0.0001,19.7279077 -0.0001,16.1731 C-0.0001,12.9443653 4.33825235,12.5128651 7.71138402,12.4965976 L8.16412764,12.4963103 C10.329545,12.5015689 15.8399,12.6382923 15.8399,16.1931 Z M7.9209,13.9961 C3.6599,13.9961 1.4999,14.7281 1.4999,16.1731 C1.4999,17.6311 3.6599,18.3701 7.9209,18.3701 C12.1809,18.3701 14.3399,17.6381 14.3399,16.1931 C14.3399,14.7351 12.1809,13.9961 7.9209,13.9961 Z M7.9209,-0.0003 C10.8489,-0.0003 13.2299,2.3817 13.2299,5.3097 C13.2299,8.2377 10.8489,10.6187 7.9209,10.6187 L7.8889,10.6187 C4.9669,10.6097 2.5999,8.2267 2.60986843,5.3067 C2.60986843,2.3817 4.9919,-0.0003 7.9209,-0.0003 Z M7.9209,1.4277 C5.7799,1.4277 4.03787882,3.1687 4.03787882,5.3097 C4.0309,7.4437 5.7599,9.1837 7.8919,9.1917 L7.9209,9.9057 L7.9209,9.1917 C10.0609,9.1917 11.8019,7.4497 11.8019,5.3097 C11.8019,3.1687 10.0609,1.4277 7.9209,1.4277 Z"
                    id="Combined-Shape"
                  ></path>
                </g>
              </g>
            </svg>
            <input
              placeholder="User Name"
              className="input"
              name="name"
              value={userName}
              onChange={handleUserNameChange}
              type="text"
              required
            />
          </div>
          <div className="flex-column">
            <label>Email </label>
          </div>
          <div
            className="inputForm"
            style={{
              border: `${
                server_error.non_field_errors || server_error.email
                  ? "1px solid Red"
                  : ""
              }`,
            }}
          >
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
              required
            />
          </div>
          <div className="flex-column">
            <label>Phone Number </label>
          </div>
          <div
            className="inputForm"
            style={{
              border: `${
                server_error.non_field_errors || server_error.phone
                  ? "1px solid Red"
                  : ""
              }`,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20px"
              height="20px"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M3 5.5C3 14.0604 9.93959 21 18.5 21C18.8862 21 19.2691 20.9859 19.6483 20.9581C20.0834 20.9262 20.3009 20.9103 20.499 20.7963C20.663 20.7019 20.8185 20.5345 20.9007 20.364C21 20.1582 21 19.9181 21 19.438V16.6207C21 16.2169 21 16.015 20.9335 15.842C20.8749 15.6891 20.7795 15.553 20.6559 15.4456C20.516 15.324 20.3262 15.255 19.9468 15.117L16.74 13.9509C16.2985 13.7904 16.0777 13.7101 15.8683 13.7237C15.6836 13.7357 15.5059 13.7988 15.3549 13.9058C15.1837 14.0271 15.0629 14.2285 14.8212 14.6314L14 16C11.3501 14.7999 9.2019 12.6489 8 10L9.36863 9.17882C9.77145 8.93713 9.97286 8.81628 10.0942 8.64506C10.2012 8.49408 10.2643 8.31637 10.2763 8.1317C10.2899 7.92227 10.2096 7.70153 10.0491 7.26005L8.88299 4.05321C8.745 3.67376 8.67601 3.48403 8.55442 3.3441C8.44701 3.22049 8.31089 3.12515 8.15802 3.06645C7.98496 3 7.78308 3 7.37932 3H4.56201C4.08188 3 3.84181 3 3.63598 3.09925C3.4655 3.18146 3.29814 3.33701 3.2037 3.50103C3.08968 3.69907 3.07375 3.91662 3.04189 4.35173C3.01413 4.73086 3 5.11378 3 5.5Z"
                stroke="#000000"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              placeholder="+977 XXXXXXXXXX"
              className="input"
              type="tel"
              name="phone"
              autoComplete="tel"
              required
            />
          </div>
          <div className="flex-column">
            <label>Password </label>
          </div>
          <div
            className="inputForm"
            style={{
              border: `${
                server_error.non_field_errors || server_error.password
                  ? "1px solid Red"
                  : ""
              }`,
            }}
          >
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
              autoComplete="new-password"
              required
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="flex-column">
            <label>Confirm Password </label>
          </div>
          <div
            className="inputForm"
            style={{
              border: `${
                server_error.non_field_errors || server_error.password2
                  ? "1px solid Red"
                  : ""
              }`,
            }}
          >
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
              placeholder="Confirm Your Password"
              className="input"
              name="password2"
              type="password"
              autoComplete="new-password"
              required
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
          <div className="flex-row">
            <div className="content">
              <label
                className="checkBox"
                style={{
                  boxShadow: `${
                    server_error.non_field_errors || server_error.tc
                      ? "0px 0px 0px 1px rgb(255 0 0 / 68%)"
                      : ""
                  }`,
                }}
              >
                <input id="ch1" name="tc" type="checkbox" />
                <div className="transition"></div>
              </label>
              <label>
                Agree with <Link to="/">Terms and Conditions</Link>
              </label>
            </div>
          </div>
          <button
            className="button-submit flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : "Sign up"}
          </button>
          <p className="p">
            Already have an account?{" "}
            <Link to="/login" className="span">
              Log In
            </Link>
          </p>
        </form>
        <div className="auth-footer">
          <p>
            Powered by{" "}
            <a
              href="https://www.kantipurinfotech.com"
              target="_bank"
              className="kit"
            >
              KIT
            </a>{" "}
            &nbsp;&nbsp;•&nbsp;&nbsp; ©pos, Inc. 2023. All Rights Reserved.
            &nbsp;&nbsp;• &nbsp;&nbsp;<a href="">Privacy Statement</a>{" "}
            &nbsp;&nbsp; • &nbsp;&nbsp;<a href="">Terms of Service</a>{" "}
            &nbsp;&nbsp;• &nbsp;&nbsp;<a href="">POS Blog</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
