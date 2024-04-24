import React, { useState } from 'react'
import style from "../Inventory/style.module.scss";
import {Link} from "react-router-dom"
import './style.scss'
const Register_Employee = () => {
    const [changes, setChanges] = useState([false, false, false, false]);

    const handleDivClick = (index) => {
        const newChanges = [...changes];
        newChanges[index] = !newChanges[index];
        setChanges(newChanges);
    };    
    const [previewImage, setPreviewImage] = useState('');

    const handleImage = (e) => {
        const selectedImage = e.target.files[0];

        // Display preview of the selected image
        if (selectedImage) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(selectedImage);
        }

        // Set the image state to the selected image
        setImage(selectedImage);
    };

  return (
    <>
        <div className={style.create_wrapper}>
                    <div className={style.create_header}>
                        <span>
                            <h1>New Employee</h1>
                            <h4>Create new Employee</h4>
                        </span>
                        <Link to="/employee" className={style.back_button}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left me-2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                            Back to Employee List
                        </Link>
                    </div>

                    <form className={`form ${style.Product_data_table}`}>
                        
                        <div className={style.Product_Information}>
                            <div className={style.header_info}>
                                <p>Employee Information</p>
                                <span className={style.button_} onClick={() => handleDivClick(0)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down chevron-down-add"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
                            </div>

                            <div className={`${changes[0] ? "collaps" : ""} ${style.Product_data}`}>
                            <div className="flex-column" style={{width: "100%"}}>
                                <label>Profile</label>
                                    <div className="Image_Uploader">
                                            <label className="custum-file-upload" for="file" style={{ backgroundImage: `${previewImage ? `url(${previewImage})` : ''}` }}>
                                            {!previewImage && (<>
                                            <div className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle plus-down-add me-0"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                                            </div>
                                                <div className="text">
                                                    <span>Add Logo</span>
                                                    </div>
                                            </>)}
                                            <input type="file" id="file" onChange={handleImage} required/>
                                </label>
                            </div>
                    </div>
                                <div className="flex-row">
                                    <div className="flex-column">
                                        <label>First Name</label>
                                        <div className="inputForm">
                                            <input type="text" className="input" placeholder="First Name"/>
                                        </div>
                                    </div>
                                    <div className="flex-column">
                                        <label>Last Name</label>
                                        <div className="inputForm">
                                            <input type="text" className="input" placeholder="Last Name"/>
                                        </div>
                                    </div>
                                    <div className="flex-column">
                                        <label>Email</label>
                                        <div className="inputForm">
                                            <input type="email" className="input" placeholder="email"/>
                                        </div>
                                    </div>
                                    <div className="flex-column">
                                        <label>Contact Number</label>
                                        <div className="inputForm">
                                            <input type="text" className="input" placeholder="+977 XXXXXXXXXX"/>
                                        </div>
                                    </div>
                                    <div className="flex-column">
                                        <label>Emp Coded</label>
                                        <div className="inputForm">
                                            <input type="text" disabled className="input" placeholder="POS00X"/>
                                        </div>
                                    </div>
                                    <div className="flex-column">
                                        <label>Date of Birth</label>
                                        <div className="inputForm">
                                            <input type="date" className="input" placeholder="Choose"/>
                                        </div>
                                    </div>
                                    <div className="flex-column">
                                        <label>Gender</label>
                                        <div className="inputForm">
                                            <input type="text" className="input" placeholder="Choose"/>
                                        </div>
                                    </div>
                                    <div className="flex-column">
                                        <label>Addresh</label>
                                        <div className="inputForm">
                                            <input type="text" className="input" placeholder="Choose"/>
                                        </div>
                                    </div>
                                    <div className="flex-column">
                                        <label>Joining date</label>
                                        <div className="inputForm">
                                            <input type="date" disabled className="input"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={style.Pricing_stock}>
                            <div className={style.header_info}>
                                    <p>Other Information</p>
                                    <span className={style.button_} onClick={() => handleDivClick(1)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down chevron-down-add"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
                            </div>
                            <div className={style.Option_wrapper}>

                            </div>
                            <div className={`${changes[1] ? "collaps" : ""} ${style.Products_Prices_Stocks}`}>
                                <div className="flex-row">
                                        <div className="flex-column">
                                            <label>Emergency No 1</label>
                                            <div className="inputForm">
                                                <input type="text" className="input" placeholder="+977 XXXXXXXX"/>
                                            </div>
                                        </div>
                                        <div className="flex-column">
                                            <label>Emergency No 1</label>
                                            <div className="inputForm">
                                                <input type="text" className="input" placeholder="+977 XXXXXXXX"/>
                                            </div>
                                        </div>

                                        <div className="flex-column">
                                            <label>Addresh</label>
                                            <div className="inputForm">
                                                <input type="text" className="input" placeholder="Addresh"/>
                                            </div>
                                        </div>
                                        <div className="flex-column">
                                            <label>Country</label>
                                            <div className="inputForm">
                                                <input type="text" className="input" placeholder="Country"/>
                                            </div>
                                        </div>
                                        <div className="flex-column">
                                            <label>City</label>
                                            <div className="inputForm">
                                                <input type="text" className="input" placeholder="City"/>
                                            </div>
                                        </div>
                                        <div className="flex-column">
                                            <label>Zipcode</label>
                                            <div className="inputForm">
                                                <input type="text" className="input" placeholder="517321"/>
                                            </div>
                                        </div>
                                </div>
                            </div>

                        </div>
                        <div className={style.Custom_Fields}>
                                <div className={style.header_info}>
                                    <p>Password</p>
                                    <span className={style.button_} onClick={() => handleDivClick(3)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down chevron-down-add"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
                                </div>
                                <div className={`${changes[3] ? "collaps" : ""} ${style.fields}`} >
                                    <div className="flex-row">
                                            <div className="flex-column">
                                                <label>Password</label>
                                                <div className="inputForm">
                                                    <input type="password" className="input" placeholder="Password"/>
                                                </div>
                                            </div>
                                            <div className="flex-column">
                                                <label>Comfirm Password</label>
                                                <div className="inputForm">
                                                    <input type="password" className="input" placeholder="Comfirm Password"/>
                                                </div>
                                            </div>

                                    </div>
                                </div>
                        </div>
                        <div className={style.Submit_Button}>
                            <button className={style.Cancel}>
                                Cancel
                            </button>
                            <button className={style.Save}>
                                Save
                            </button>
                        </div>
                    </form>
        </div>
      
    </>
  )
}
export default Register_Employee
