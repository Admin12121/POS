import React, { useEffect, lazy, Suspense, useState } from "react";
import "./App.scss";
import {
  Routes,
  Navigate,
  Route,
  useLocation,
  useNavigate
} from "react-router-dom";
import { Toaster } from "sonner";
import { useDispatch } from "react-redux";
import { useGetLoggedUserQuery, useRefreshAccessTokenMutation } from './Fetch_Api/Service/User_Auth_Api';
import { setUserToken, unSetUserToken } from './Fetch_Api/Feature/authSlice';
import { getToken,storeToken ,removeToken} from './Fetch_Api/Service/LocalStorageServices';
import Navbar from "./Components/Navbar/Navbar";
import Sidebar from "./Components/Sidebar/Sidebar";
import Admin_Dashboard from "./Pages/Dashboard/Admin/Admin_Dashboard";
import Products from "./Pages/Inventory/Products";
import CreateProduct from "./Pages/Inventory/CreateProduct";
import EpiredProducts from "./Pages/Inventory/EpiredProducts";
import Loader from "./Components/Loader/Loader";
import Category from "./Pages/Inventory/Category";
import UserActive from "./Pages/Login/UserActive";
import Resetpassword from "./Pages/Login/Resetpassword";
import Register_Store from "./Pages/Login/Register_Store";
import {toast } from 'sonner';
import SubCategory from "./Pages/Inventory/SubCategory";
import Brand from "./Pages/Inventory/Brand";
import Customer from "./Pages/People/Customer";
import Employee from "./Pages/People/Employee";
import Register_Employee from "./Pages/People/Register_Employee";
import AuthLayout from "./Layout/AuthLayout"
const App = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true)
  const { access_token,refresh_token } = getToken();
  const [server_error, setServerError] = useState({});
  const { data, isSuccess, isError, error } = useGetLoggedUserQuery(access_token);
  const [update, {isLoading}] = useRefreshAccessTokenMutation();
  const navigate = useNavigate();
  const updateToken = async () => {
    const actualData = {
      refresh: getToken().refresh_token,
    };

    const res = await update(actualData);
    if (res.error) {
      setServerError("error when updating token");
    }
    if (res.data) {
      storeToken(res.data);
      let { access_token,refresh_token } = getToken();
      dispatch(setUserToken({ access_token, refresh_token }));
    }
  };

  useEffect(()=>{
     if(loading){
       updateToken();
     }

    let interval = setInterval(()=>{
       if(refresh_token){
         updateToken();
       }
     }, 18000000)
    return () => clearInterval(interval)

  },[refresh_token, loading] )

  useEffect(() => {
    dispatch(setUserToken({ access_token: access_token }));
    if(loading){
      setLoading(false)
    }
  }, [access_token, dispatch]);
  // if (isError) {
  //   console.log( error.data.errors.detail);
  //   console.log( error.status);
  //   toast.success(error.data.errors.detail, {
  //     action: {
  //       label: 'X',
  //       onClick: () => toast.dismiss(),
  //     },} );
  //     if(error.status == 401){
  //         dispatch(unSetUserToken({ access_token: null }));
  //         removeToken();
  //         toast.success("Logged out", {
  //           action: {
  //             label: 'X',
  //             onClick: () => toast.dismiss(),
  //           },})
  //     }

  // }

  if(data && !data.stor){
    return(
      <>
        <Register_Store email={data.email}/>
      </>
    )
  }else
    return (
      <>
            {data && <AppContent data={data} />}
      </>
    );
};

const AppContent = ({data}) => {

  const Login = lazy(() => import('./Pages/Login/Login'));
  const Signin = lazy(() => import('./Pages/Login/Signin'));


  const dispatch = useDispatch();
  const location = useLocation();
  const isLoginRoute = ["/login", "/signin", '/reset', '/comfirm', '/forgot-password'].includes(location.pathname);
  let { access_token } = getToken();
  useEffect(() => {
    dispatch(setUserToken({ access_token: access_token }));
  }, [access_token, dispatch]);
  const [sidebar, setSidebar] = useState(false);

  return (
    <>
      <Toaster />
      {!isLoginRoute && <Navbar user={data} bar={setSidebar} active={sidebar} />}
      <section className="main_container">
        {!isLoginRoute && <Sidebar active={sidebar} />}
        <div className="main_dashboard_wrapper" style={{height:`${isLoginRoute ? '100vh': "92vh"}`}} >
          <Routes>
            <Route path="login" element={ !access_token ? <Suspense fallback={<Loader/>}><Login /></Suspense> : <Navigate to="/" />}/>
            <Route path="signin" element={!access_token ? <Suspense fallback={<Loader/>}><Signin /></Suspense>: <Navigate to="/" />}/>
            <Route path="forgot-password" element={!access_token ? <Suspense fallback={<Loader/>}><Resetpassword/></Suspense>: <Navigate to="/" />}/>
            <Route index element={access_token ? <Admin_Dashboard/> : <Navigate to="/login" />} />
            <Route path="products" element={access_token ?<Products user={data}/> : <Navigate to="/login" />} />
            <Route path="api/user/reset/:id/:token" element={<Resetpassword/>}/>
            <Route path="/accounts/activate/:uidb64/:token" element={<UserActive/>}/>
            <Route path="create_product" element={access_token ?<CreateProduct user={data}/>: <Navigate to="/login" />} />
            <Route path="expired_product" element={access_token ?<EpiredProducts user={data}/> : <Navigate to="/login" />} />
            <Route path="category" element={access_token ?<Category user={data}/>: <Navigate to="/login" />} />
            <Route path="sub-category" element={access_token ?<SubCategory user={data}/>: <Navigate to="/login" />} />
            <Route path="brand" element={access_token ?<Brand user={data}/>: <Navigate to="/login" />} />
            <Route path="customer" element={access_token ?<Customer user={data}/>: <Navigate to="/login" />} />
            <Route path="employee" element={access_token ?<Employee user={data}/>: <Navigate to="/login" />} />
            <Route path="register-employee" element={access_token ?<Register_Employee user={data}/>: <Navigate to="/login" />} />
            <Route path="*" element={<h1>Error 404 Page not found !!</h1>} />
          </Routes>
        </div>
      </section>
    </>
  );
};

export default App;
