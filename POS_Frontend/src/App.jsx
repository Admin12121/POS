import React, { useEffect, lazy, Suspense, useState } from "react";
import "./App.scss";
import {
  BrowserRouter as Router,
  Routes,
  Navigate,
  Route,
  useLocation,
} from "react-router-dom";
import { Toaster } from "sonner";
import { setUserToken } from "./Fetch_Api/Feature/authSlice";
import { useDispatch } from "react-redux";
import { getToken } from "./Fetch_Api/Service/LocalStorageServices";
import Navbar from "./Components/Navbar/Navbar";
import Sidebar from "./Components/Sidebar/Sidebar";
import Admin_Dashboard from "./Pages/Dashboard/Admin/Admin_Dashboard";
import Products from "./Pages/Inventory/Products";
import Login from "./Pages/Login/Login";
const App = () => {
  return (
    <>
      <Router>
        <AppContent />
      </Router>
    </>
  );
};

const AppContent = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isLoginRoute = ["/login", "/signin", '/reset', '/comfirm'].includes(location.pathname);
  let { access_token } = getToken();
  useEffect(() => {
    dispatch(setUserToken({ access_token: access_token }));
  }, [access_token, dispatch]);

  const [sidebar, setSidebar] = useState(false);
  return (
    <>
      <Toaster />
      {!isLoginRoute && <Navbar bar={setSidebar} active={sidebar} />}
      <section className="main_container">
        {!isLoginRoute && <Sidebar active={sidebar} />}
        <div className="main_dashboard_wrapper">
          <Routes>
            <Route index element={<Admin_Dashboard/>} />
            <Route path="products" element={<Products/>} />
            <Route path="login" element={<Login/>}/>
            <Route path="*" element={<h1>Error 404 Page not found !!</h1>} />
          </Routes>
        </div>
      </section>
    </>
  );
};

export default App;
