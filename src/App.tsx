import  { useEffect, lazy, Suspense } from "react";
import {Routes,Navigate,Route,useLocation} from "react-router-dom";
import { Toaster } from "sonner";
import { useDispatch } from "react-redux";
import { setUserToken } from '@/fetch_Api/feature/authSlice';
import { getToken} from '@/fetch_Api/service/localStorageServices';
import Dashboard from "@/pages/dashboard/Dashboard";
import CreateProduct from "@/pages/Inventory/CreateProduct";
import EpiredProducts from "@/pages/Inventory/EpiredProducts";
import Loader from "@/components/loader/loader";
import Category from "@/pages/Inventory/Category";
import Resetpassword from "@/pages/login/Resetpassword";
import SubCategory from "@/pages/Inventory/SubCategory";
import Brand from "@/pages/Inventory/Brand";
import Customer from "@/pages/people/Customer";
import Employee from "@/pages/people/Employee";
import Register_Employee from "@/pages/people/Register_Employee";
import Comfermation from "@/pages/login/Comfermation";
import Staff_Dashboard from "@/pages/dashboard/Staff/Staff_Dashboard";
import Product_view from "@/pages/Inventory/Product_view";
import UpdateProduct from "@/pages/Inventory/UpdateProduct";
import SubSubCategory from "@/pages/Inventory/SubSubCategory";
import LowStock from "@/pages/Inventory/LowStock";
import Profile from "@/pages/dashboard/Profile";
import Invoice_report from "@/pages/Invoice/Invoice_report";
import Sales_LIst from "@/pages/Invoice/Sales_LIst";
import Credits from "@/pages/Invoice/Credits";
import Otp from "@/pages/login/otp";


const App = () => {
  const Login = lazy(() => import('@/pages/login/Login'));
  const Signin = lazy(() => import('@/pages/login/Signin'));
  const Admin_Dashboard = lazy(() => import('@/pages/dashboard/Admin/Admin_Dashboard'));
  const Products = lazy(() => import('@/pages/Inventory/Products'));
  const POS = lazy(() => import('@/pages/sales/POS'));
  const dispatch = useDispatch();
  const location = useLocation();
  const { access_token } = getToken();

  useEffect(() => {
    if (location.pathname === '/superadmin') {
      console.log('User is on the special path');
    }
  }, [location]);

  useEffect(() => {
    dispatch(setUserToken({ access_token }));
  }, [access_token, dispatch]);

  return(
    <>
    <Toaster />
      <Routes>
         <Route path="login" element={ !access_token ? <Suspense fallback={<Loader/>}><Login /></Suspense> : <Navigate to="/" />}/>
         <Route path="signin" element={!access_token ? <Suspense fallback={<Loader/>}><Signin /></Suspense>: <Navigate to="/" />}/>
         <Route path="/accounts/activate/:email" element={!access_token ? <Suspense fallback={<Loader/>}><Otp/></Suspense> : <Navigate to="/" />}/>
         <Route path="api/user/reset/:id/:token" element={!access_token ? <Comfermation/> : <Navigate to="/" />}/>
         <Route path="forgot-password" element={!access_token ? <Suspense fallback={<Loader/>}><Resetpassword/></Suspense>: <Navigate to="/" />}/>
         <Route path="/" element={access_token ? <Dashboard/> : <Navigate to="/login" />} >
           <Route index element={ <Suspense fallback={<Loader login={access_token}/>}><Admin_Dashboard/></Suspense>}/>
           <Route path="staff" element={<Staff_Dashboard/>}/>
           <Route path="profile" element={<Profile/>}/>
           <Route path="products" element={<Suspense fallback={<Loader login={access_token}/>}><Products/></Suspense>} />
           <Route path="lowstock-products" element={<LowStock />} />
           <Route path="products/:product_name/:id" element={<Product_view/>}/>
           <Route path="products/update-products/:product_name/:id" element={<UpdateProduct/>}/>
           <Route path="create_product" element={<CreateProduct/>} />
           <Route path="expired_product" element={<EpiredProducts/>} />
           <Route path="category" element={<Category/>}/>
           <Route path="sub-category" element={<SubCategory />} />
           <Route path="sub-sub-category" element={<SubSubCategory />} />
           <Route path="brand" element={<Brand/>} />
           <Route path="customer" element={<Customer />} />
           <Route path="employee" element={<Employee/>} />
           <Route path="register-employee" element={<Register_Employee />} />
           <Route path="sales" element={<Sales_LIst />} />
           <Route path="invoice_report" element={<Invoice_report />} />
           <Route path="credit-details" element={<Credits />} />
           <Route path="pos" element={<Suspense fallback={<Loader login={access_token}/>}><POS/></Suspense>}/>
         </Route>
         <Route path="*" element={<span className="flex justify-center items-center h-screen"><h1>Error 404 Page not found !!</h1></span>} />
      </Routes>
    </>
  )
};

export default App;
