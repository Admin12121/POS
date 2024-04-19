import React, { useEffect, lazy, Suspense, useState } from "react";
import "./App.scss";
import {
  Routes,
  Navigate,
  Route,
  useLocation,
} from "react-router-dom";
import { Toaster } from "sonner";
import { useDispatch } from "react-redux";
import { useGetLoggedUserQuery, useRefreshAccessTokenMutation } from './Fetch_Api/Service/User_Auth_Api';
import { setUserToken, unSetUserToken } from './Fetch_Api/Feature/authSlice';
import { getToken,storeToken } from './Fetch_Api/Service/LocalStorageServices';
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
const App = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true)
  const { access_token,refresh_token } = getToken();
  const [server_error, setServerError] = useState({});
  const [update, {isLoading}] = useRefreshAccessTokenMutation();
  const { data, isSuccess } = useGetLoggedUserQuery(access_token);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);

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

  if(data && !data.stor){
    return(
      <>
        <Register_Store email={data.email}/>
      </>
    )
  }else
    return (
      <>
          <AppContent data={data} />
      </>
    );
};

const AppContent = ({data}) => {

  const Login = lazy(() => import('./Pages/Login/Login'));
  const Signin = lazy(() => import('./Pages/Login/Signin'));


  const dispatch = useDispatch();
  const location = useLocation();
  const isLoginRoute = ["/login", "/signin", '/reset', '/comfirm','/accounts/activate/'].includes(location.pathname);
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
            <Route index element={access_token ? <Admin_Dashboard/> : <Navigate to="/login" />} />
            <Route path="products" element={access_token ?<Products/> : <Navigate to="/login" />} />
            <Route path="api/user/reset/:id/:token" element={<Resetpassword/>}/>
            <Route path="/accounts/activate/:uidb64/:token" element={<UserActive/>}/>
            <Route path="create_product" element={access_token ?<CreateProduct/>: <Navigate to="/login" />} />
            <Route path="expired_product" element={access_token ?<EpiredProducts/> : <Navigate to="/login" />} />
            <Route path="category" element={access_token ?<Category/>: <Navigate to="/login" />} />
            <Route path="login" element={ !access_token ? <Suspense fallback={<Loader/>}><Login /></Suspense> : <Navigate to="/" />}/>
            <Route path="signin" element={!access_token ? <Suspense fallback={<Loader/>}><Signin /></Suspense>: <Navigate to="/" />}/>
            <Route path="*" element={<h1>Error 404 Page not found !!</h1>} />
          </Routes>
        </div>
      </section>
    </>
  );
};

export default App;
