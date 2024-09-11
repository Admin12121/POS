import  { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Loader from '@/components/loader/loader';
import {toast } from 'sonner';
import axios from 'axios';
import './active.scss'

const UserActive = () => {
    const [loading, setLoading] = useState(false)
    const { uidb64, token } = useParams();
    const [success, setSuccess] = useState(true)

    useEffect(() => {
        const activateUser = async () => {
          try {
            const response = await axios.get(`${import.meta.env.VITE_KEY_BACKEND_DOMAIN}/accounts/activate/${uidb64}/${token}/`);
            if(response.data){
                console.log(response.data)
                setSuccess(true)
                setLoading(false)
                toast.success(response.data.msg, {
                  action: {
                    label: 'X',
                    onClick: () => toast.dismiss(),
                  },} );
            }
          } catch (error:any) {
            toast.error(error.response.data.msg, {
              action: {
                label: 'X',
                onClick: () => toast.dismiss(),
              },});
          }
        };
        activateUser();
    }, [uidb64, token]);
  return (
    <>
        <div className={`activator ${success ? 'success' : 'fail'}`}>
        {loading ? <Loader/> : 
        <div className="card"> 
                    <div className="header"> 
                        <div className="image">
                            {success  ?   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><g strokeWidth="0" id="SVGRepo_bgCarrier"></g><g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="1.5" stroke="#000000" d="M20 7L9.00004 18L3.99994 13"></path> </g></svg>: 
                                <svg aria-hidden="true" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" fill="none">
                                  <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" strokeLinejoin="round" strokeLinecap="round"></path>
                                </svg>}
                        </div> 
                        <div className="content">
                            <span className="title">{success ? "Account Activated" : "Fail to Active Your Account"}</span> 
                            <p className="message">Thank you for Visiting.You can Login now</p> 
                        </div> 
                        <div className="actions">
                            <Link to="/login" type="button" className="history">Login</Link> 
                            {!success && <button type="button" className="track">Resend Activation Link</button>}
                        </div> 
                    </div> 
            </div>}
        </div>      
    </>
  )
}

export default UserActive
