import {useState, useEffect} from 'react'
import { useNavigate} from "react-router-dom";
import {toast } from 'sonner';
import { useStoreRegistrationMutation } from "@/fetch_Api/service/user_Auth_Api";
import './store.scss'

interface RegisterStoreProps {
  email: string;
}

interface ServerError {
  [key: string]: string[];
}

const Register_Store = ({email}:RegisterStoreProps) => {
    const [RegStore, { isLoading }] = useStoreRegistrationMutation();
    const [server_error, setServerError] = useState<ServerError>({});
    const [previewImage, setPreviewImage] = useState('');
    const [logfile, setLogFile] = useState();
    const navigate = useNavigate();
    const handleImage = (e:any) => {
      const selectedImage = e.target.files[0];
      if (selectedImage) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setPreviewImage(reader.result as string);
          };
          reader.readAsDataURL(selectedImage);
        }
        setLogFile(selectedImage);
  };
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
    const handleSubmit = async (e:any) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', e.currentTarget.elements.store.value);
        formData.append('owner_email', email);
        formData.append('email', e.currentTarget.elements.email.value);
        formData.append('phone_no', e.currentTarget.elements.phone.value);
        formData.append('addresh', e.currentTarget.elements.addresh.value);
        formData.append('vat_no', e.currentTarget.elements.vat.value);
        formData.append('pan_no', e.currentTarget.elements.pan.value);
        if(logfile){
          formData.append('logo', logfile);
        }
        const res = await RegStore({formData });
        if (res.data) {
          navigate('/login')
          window.location.reload();
        }
        if (res.error && 'data' in res.error && res.error.data) {
          setServerError((res.error.data as any).errors);
        }
      };

  return (
    <>
      <div className="Create_store">
        <form className='form' action="" onSubmit={handleSubmit} >
            <h1>Register Your Store</h1>
            <p>{email}</p>
          <div className="flex-row">
            <div className="flex-column" style={{width:"65%"}}>
            <label>Store Email </label>
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
              placeholder={`${email}`}
              className="input"
              name="email"
              type="text"
              required
            />
          </div>
          </div>
          <div className="flex-column" style={{width:"30%"}}>
                    <label>Store Logo</label>
                    <div className="Image_Uploader">
                      <label className="custum-file-upload" htmlFor="file" style={{ backgroundImage: `${previewImage ? `url(${previewImage})` : ``}` }}>
                          {!previewImage  && (<>
                            <div className="icon">
                              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle plus-down-add me-0"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                          </div>
                          <div className="text">
                              <span>Add Logo</span>
                              </div>
                          </>)}
                              <input type="file" id="file" name="logo" onChange={handleImage} />
                      </label>
                    </div>
                </div>
            <div className="flex-column">
            <label>Store Name</label>
          <div className="inputForm" >
            <svg width="24px"  height="24px"  viewBox="0 0 24 24"  version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                  <g id="Iconly/Light/Bag-2" stroke="#000000"  stroke-width="1.5"  fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
                      <g id="Bag-2" transform="translate(3.000000, 2.500000)" stroke="#000000"  stroke-width="1.5" >
                          <path d="M12.7729,6.80503597 L12.7729,3.77303597 C12.7729,1.68903597 11.0839,-1.42108547e-14 9.0009,-1.42108547e-14 C6.9169,-0.00896402892 5.2199,1.67203597 5.2109,3.75603597 L5.2109,3.77303597 L5.2109,6.80503597" id="Stroke-1"></path>
                          <path d="M13.7422153,18.500336 L4.2577847,18.500336 C1.90569395,18.500336 0,16.595336 0,14.245336 L0,8.72933597 C0,6.37933597 1.90569395,4.47433597 4.2577847,4.47433597 L13.7422153,4.47433597 C16.094306,4.47433597 18,6.37933597 18,8.72933597 L18,14.245336 C18,16.595336 16.094306,18.500336 13.7422153,18.500336 Z" id="Stroke-3"></path>
                      </g>
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
              <div className="flex-column" style={{width:"47%"}}>
              <label>Store Phone</label>
              <div className="inputForm" >
                <input
                  placeholder="Store Phone Number"
                  className="input"
                  name="phone"
                  type="text"
                  required
                />
              </div>
            </div>
            <div className="flex-column" style={{width:"47%"}}>
                <label>Store Address</label>
                <div className="inputForm" >
                  <input
                    placeholder="Store Address"
                    className="input"
                    name="addresh"
                    type="text"
                    required
                  />
              </div>
            </div>
              <div className="flex-column" style={{width:"47%"}}>
              <label>Store Vat Number</label>
              <div className="inputForm" >
                <input
                  placeholder="Store Vat Number"
                  className="input"
                  name="vat"
                  type="text"
                />
              </div>
            </div>
            <div className="flex-column" style={{width:"47%"}}>
                <label>Store Pan Number</label>
                <div className="inputForm" >
                  <input
                    placeholder="Store Pan Number"
                    className="input"
                    name="pan"
                    type="text"
                  />
              </div>
            </div>
          </div>
          {isLoading ? <button disabled style={{background:'#151717f2'}} className="button-submit"><svg className="svg_loader" viewBox="25 25 50 50"><circle className="svgcircle" r="20" cy="50" cx="50"></circle></svg></button> : <button className="button-submit">Register Store Name</button>}
        </form>
      </div> 
    </>
  )
}

export default Register_Store
