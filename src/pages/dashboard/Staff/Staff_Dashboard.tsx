import {useState,useEffect} from 'react'
import { Link } from 'react-router-dom'
import { useDashboardData } from '@/pages/dashboard/Dashboard';
import "./style.scss"
const Staff_Dashboard = () => {
    const { userData } = useDashboardData();
    const [_storeCode, setStoreCode]  = useState("")
    useEffect(()=>{
        if(userData){
          setStoreCode(userData.stor.code)
        }
      },[userData])
  return (
    <>
      <div className="staff_dashboard_wrapper">
        <div className="staff_nav_">
          <span className='welcome'>
            <h1>👋 Hi {userData && userData.first_name}</h1>
            <p>Here's what's happening with your store today</p>
          </span>
          <span className='_cos_nav_action_button'>
            <div className="nav_date_item">
                sdgsdgsdgsdgdsgsdgsd
            </div>
            <span className="nav_item">
                <Link to="/" className="icon_links" >
                <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-rotate-ccw"
                        >
                            <polyline points="1 4 1 10 7 10"></polyline>
                            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                        </svg>
                </Link>
            </span>
          </span>
        </div>
        <div className="card_box">
            <div className="card_main"></div>
            <div className="card_wrapper">
            <div className="card"></div>
            <div className="card"></div>
            </div>

        </div>

      </div>
    </>
  )
}

export default Staff_Dashboard
