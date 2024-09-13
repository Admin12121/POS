import  { createContext, useContext, useEffect, useState } from 'react';
import Navbar from '@/components/navbar/navbar'
import Sidebar from '@/components/sidebar/sidebar'
import { getToken,storeToken } from '@/fetch_Api/service/localStorageServices';
import { useDispatch } from "react-redux";
import { useGetLoggedUserQuery, useRefreshAccessTokenMutation } from '@/fetch_Api/service/user_Auth_Api';
import { setUserToken } from '@/fetch_Api/feature/authSlice';
import { Outlet } from 'react-router-dom';
import Register_Store from "@/pages/login/Register_Store";

const DashboardDataContext = createContext<any>(null);
export const useDashboardData = () => useContext(DashboardDataContext);

const Dashboard = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true)
  const [update] = useRefreshAccessTokenMutation();
   const [sidebar, setSidebar] = useState(false);
   const { access_token,refresh_token } = getToken();
   const { data, refetch } = useGetLoggedUserQuery({access_token});

   const userData = data;
   const Refetch = refetch;
   const shouldHideSidebar = location.pathname === "/pos";

   const updateToken = async () => {
    const actualData = {
      refresh: getToken().refresh_token,
    };
   if(access_token) { const res = await update(actualData);
    if (res.error) {
      console.log(res.error)
    }
    if (res.data) {
      storeToken(res.data);
      let { access_token,refresh_token } = getToken();
      dispatch(setUserToken({ access_token, refresh_token }));
    }}
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
    return<Register_Store email={data.email}/>
  }


  return (
    <>
      <Navbar user={data} bar={setSidebar} active={sidebar} />
      <section className="main_container">
       {!shouldHideSidebar && <Sidebar  active={sidebar} user={data}/>}
        <div className="main_dashboard_wrapper" >
          <DashboardDataContext.Provider value={{ userData , Refetch}}>
            <Outlet/>
          </DashboardDataContext.Provider>
        </div>
      </section>
    </>
  )
}

export default Dashboard
