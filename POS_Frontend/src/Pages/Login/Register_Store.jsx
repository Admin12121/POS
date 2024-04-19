import React,{useState, useEffect} from 'react'
import './store.scss'
import { useNavigate} from "react-router-dom";
import { useStoreRegistrationMutation } from "../../Fetch_Api/Service/User_Auth_Api";

const Register_Store = ({email}) => {
    const [RegStore, { isLoading }] = useStoreRegistrationMutation();
    const [server_error, setServerError] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        if (Object.keys(server_error).length > 0) {
          const errorKey = Object.keys(server_error)[0];
          if (server_error[errorKey] && server_error[errorKey].length > 0) {
            const errorMessage = server_error[errorKey][0];
            toast.error(errorMessage, {
              action: {
                label: 'X',
                onClick: () => toast.dismiss(),
              },} );
          }
        }
      }, [server_error]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const actualData = {
          owner_email: email,
          name: data.get("store"),
        };
        console.log(actualData)
        const res = await RegStore(actualData);
        if (res.error) {
            console.log(res.error)
          setServerError(res.error)
        }
        if (res.data) {
          toast.success(res.data.msg, {
            action: {
              label: 'X',
              onClick: () => toast.dismiss(),
            },} );
          redirect()
        }
      };
      function redirect() {
        navigate('/')
      }
  return (
    <>
      <div className="Create_store">
        <form className='form' action="" onSubmit={handleSubmit}>
            <h1>Register Your Store</h1>
            <div className="flex-column">
            <label>Email </label>
          <div className="inputForm" >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              viewBox="0 0 32 32"
              height="20"
            >
              <g data-name="Layer 3" id="Layer_3">
                <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path>
              </g>
            </svg>
            <input
              placeholder="Enter your Email"
              className="input"
              name="owner"
              type="text"
              value={email}
              disabled
            />
          </div>
          </div>
            <div className="flex-column">
            <label>Store Name</label>
          <div className="inputForm" >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              viewBox="0 0 32 32"
              height="20"
            >
              <g data-name="Layer 3" id="Layer_3">
                <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path>
              </g>
            </svg>
            <input
              placeholder="Store Name"
              className="input"
              name="store"
              type="text"
              required
            />
          </div>
          </div>
          {isLoading ? <button disabled style={{background:'#151717f2'}} className="button-submit"><svg className="svg_loader" viewBox="25 25 50 50"><circle className="svgcircle" r="20" cy="50" cx="50"></circle></svg></button> : <button className="button-submit">Register Store Name</button>}
        </form>
      </div> 
    </>
  )
}

export default Register_Store
