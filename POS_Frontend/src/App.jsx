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
import CreateProduct from "./Pages/Inventory/CreateProduct";
import EpiredProducts from "./Pages/Inventory/EpiredProducts";
import Loader from "./Components/Loader/Loader";
import Category from "./Pages/Inventory/Category";
import ResetPassword from "./Pages/Login/Resetpassword";
import CreatePassword from "./Pages/Login/CreatePassword";
import EmailVarification from "./Pages/Login/EmailVarification";
import Employee from "./Pages/HRM/Employee";
import AddEmployee from "./Pages/HRM/AddEmployee";

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
  const Login = lazy(() => import("./Pages/Login/Login"));
  const Signin = lazy(() => import("./Pages/Login/Signin"));
  const CreatePassword = lazy(() => import("./Pages/Login/CreatePassword"));
  const EmailVarification = lazy(() =>
    import("./Pages/Login/EmailVarification")
  );
  const ResetPassword = lazy(() => import("./Pages/Login/Resetpassword"));
  const Employee = lazy(() => import("./Pages/HRM/Employee"));
  const AddEmployee = lazy(() => import("./Pages/HRM/AddEmployee"));

  const dispatch = useDispatch();
  const location = useLocation();
  const isLoginRoute = [
    "/login",
    "/signin",
    "/reset",
    "/comfirm",
    "/forget_password",
    "/create_password",
    "/verify_email",
  ].includes(location.pathname);
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
            <Route index element={<Admin_Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="create_product" element={<CreateProduct />} />
            <Route path="expired_product" element={<EpiredProducts />} />
            <Route path="category" element={<Category />} />
            <Route
              path="login"
              element={
                <Suspense fallback={<Loader />}>
                  <Login />
                </Suspense>
              }
            />
            <Route
              path="signin"
              element={
                <Suspense fallback={<Loader />}>
                  <Signin />
                </Suspense>
              }
            />
            <Route
              path="forget_password"
              element={
                <Suspense fallback={<Loader />}>
                  <ResetPassword />
                </Suspense>
              }
            />
            <Route
              path="create_password"
              element={
                <Suspense fallback={<Loader />}>
                  <CreatePassword />
                </Suspense>
              }
            />
            <Route
              path="verify_email"
              element={
                <Suspense fallback={<Loader />}>
                  <EmailVarification />
                </Suspense>
              }
            />
            <Route
              path="employee"
              element={
                <Suspense fallback={<Loader />}>
                  <Employee />
                </Suspense>
              }
            />
            <Route
              path="add_employee"
              element={
                <Suspense fallback={<Loader />}>
                  <AddEmployee />
                </Suspense>
              }
            />

            <Route path="*" element={<h1>Error 404 Page not found !!</h1>} />
          </Routes>
        </div>
      </section>
    </>
  );
};

export default App;
