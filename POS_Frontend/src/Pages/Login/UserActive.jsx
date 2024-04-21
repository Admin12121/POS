import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Loader from '../../Components/Loader/Loader';
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
            const response = await axios.get(`http://localhost:8000/accounts/activate/${uidb64}/${token}/`);
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
            // Optionally, you can redirect the user to a success page or display a success message
          } catch (error) {
            toast.error(error, {
              action: {
                label: 'X',
                onClick: () => toast.dismiss(),
              },});
            // Optionally, you can redirect the user to an error page or display an error message
          }
        };
        activateUser();
    }, [uidb64, token]);
  return (
    <>
        <div className={`activator ${success ? 'success' : 'fail'}`}>
        {loading ? <Loader/> : 
        <div class="card"> 
                    <div class="header"> 
                        <div class="image">
                            {success  ?   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><g stroke-width="0" id="SVGRepo_bgCarrier"></g><g strokeLinejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path strokeLinejoin="round" stroke-linecap="round" stroke-width="1.5" stroke="#000000" d="M20 7L9.00004 18L3.99994 13"></path> </g></svg>: 
                                <svg aria-hidden="true" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" fill="none">
                                  <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" strokeLinejoin="round" stroke-linecap="round"></path>
                                </svg>}
                        </div> 
                        <div class="content">
                            <span class="title">{success ? "Account Activated" : "Fail to Active Your Account"}</span> 
                            <p class="message">Thank you for Visiting.You can Login now</p> 
                        </div> 
                        <div class="actions">
                            <Link to="/login" type="button" class="history">Login</Link> 
                            {!success && <button type="button" className="track">Resend Activation Link</button>}
                        </div> 
                    </div> 
            </div>}
        </div>      
    </>
  )
}

export default UserActive
