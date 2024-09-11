import  { useState,useEffect, useRef } from "react";
import {Link,useNavigate} from "react-router-dom"
import styles from "./style.module.scss";
import { useDispatch } from "react-redux";
import {toast } from 'sonner';
import { unSetUserToken } from '../../fetch_Api/feature/authSlice';
import { removeToken } from '../../fetch_Api/service/localStorageServices';
import { parseISO, formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

interface User {
  profile: string;
  stor: {
    name: string;
  };
  first_name: string;
  last_name: string;
  is_admin: boolean;
  employee_role: string;
}

interface Notification {
  id: number;
  message: string;
  seen: boolean;
  created_at: string;
}

interface NavbarProps {
  user: User;
  bar: (prev: boolean) => void;
  active: boolean;
  notifications: Notification[];
  markAsSeen?: (id: number) => void;
}

interface HandelNotificationProps {
  notifications: Notification[];
  setnot: (value: boolean) => void;
  markAsSeen?: (id: number) => void;
}


const Navbar: React.FC<NavbarProps> = ({user, bar, active,notifications,markAsSeen}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [not, setnot] = useState(false)
  const [notie , setNotie ] = useState(false);
  const handleLogout = () => {
    dispatch(unSetUserToken({ access_token: null }));
    removeToken();
    navigate('/login');
    toast.success("Logged out", {
      action: {
        label: 'X',
        onClick: () => toast.dismiss(),
      },})
  };
  const unseenNotificationsCount = notifications.filter(notification => !notification.seen).length;

  useEffect(() => {
    if (unseenNotificationsCount > 0) {
      setNotie(true);
    } else {
      setNotie(false);
    }
  }, [notifications]); 

  return (

    <div className={styles.navbar}>
        <div className={styles.sidebar_button}>
          <label className="hamburger" onClick={() => bar(!active)}>
                <svg viewBox="0 0 32 32" className={`${active ? "checked_svg" : ""}`}>
                    <path className={`line line-top-bottom ${active ? "active_hamberger" : ""}`} d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
                    <path className="line" d="M7 16 27 16"></path>
                </svg>
            </label>
        </div>
      <div className={styles.left_logo}>
        <Link to="/">
            <img src="https://kantipurinfotech.com/wp-content/themes/kantipurinfotech/assets/images/kit-logo.svg" alt="" />
        </Link>

        <span className={`${styles.profile_image_mini}`}>
              {user && <img style={{height:"100%", width: "100%", objectFit:"cover"}} src={user.profile ? user.profile : "https://i.pinimg.com/564x/97/4f/05/974f05ce910b98c192c09d0b55afd01e.jpg"} alt="" className="img-fluid"/>}
        </span>
     
      </div>
      <div className={styles.right_component}>
        <div className={styles.searchbar}>
          <input type="text" placeholder="Search" />
        </div>
        <div className={styles.profile_settings}>

            <span className={styles.nav_item} style={{width:"unset", padding : "0 10px", border: "1px solid #1212122b"}}>
                <Link to="/" className={styles.icon_links}>
                  <span style={{display:"flex", gap:"10px"}}>
                    <img src="" alt=""  style={{width:"20px", height:"20px", borderRadius:"50%"}}/>
                    <p>{user && user.stor.name}</p>
                  </span>
                </Link>
            </span>
            <span className={styles.nav_item}>
                <Link to="/" className={styles.icon_links}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-maximize"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
                </Link>
            </span>
            <span className={styles.nav_item}>
                <Link to="/" className={styles.icon_links}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </Link>
            </span>
            <span className={styles.nav_item} onClick={()=>setnot(prev => !prev)}>
                <span className={styles.icon_links}>
                  {notie && <span className={styles.pop}> {unseenNotificationsCount} </span>}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bell"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                </span>
            </span>
            <span className={styles.nav_item}>
                <Link to='/' className={styles.icon_links}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-settings"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                </Link>
            </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span className="flex items-center gap-2 mr-3">
                  <Avatar className="w-10 h-10 rounded-md">
                    <AvatarImage  className="object-cover" src={user && user.profile} alt="@shadcn" />
                    <AvatarFallback>{user && `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`}</AvatarFallback>
                  </Avatar>
                  <div className={styles.profile}>
                    <h1>{user && user.first_name}</h1>
                    <h2>{user && user.is_admin ? "Admin" : user && user.employee_role}</h2>
                  </div>
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={()=>navigate("/profile")}>Profile</DropdownMenuItem>
              <DropdownMenuItem>Setting</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="hover:bg-red-200 cursor-pointer">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {not && <Handel_notification setnot={setnot} notifications={notifications} markAsSeen={markAsSeen}/>}
    </div>
  );
};


const Handel_notification: React.FC<HandelNotificationProps> = ({ notifications, setnot, markAsSeen }) => {
  const notificationRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event: MouseEvent) => {
    if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
      setnot(false);
    }
  };


  return(
    <>
      <div ref={notificationRef} className={styles.notification}>
       <span className={styles.notification_header}> <h1>Notifications</h1> <p>clear all x</p></span>
          {notifications.map((notification, index) => (
            <div onClick={() => markAsSeen ? markAsSeen(notification.id) : null} key={index} className={styles.notification_data} style={{background:`${notification.seen ? "" : "var(--primary-color)"}`,color:`${notification.seen ? "" : "#fff"}`}}>
              <p>{notification.message}</p>
              <p>{formatDistanceToNow(parseISO(notification.created_at))} ago</p>
            </div>
          ))}
      </div>
    </>
  )
}

export default Navbar;