import React, { useState } from 'react'
import style from "./style.module.scss";
import {Link} from "react-router-dom"
import './style.scss'
const CreateProduct = () => {
    const [changes, setChanges] = useState([false, false, false, false]);

    const handleDivClick = (index) => {
        const newChanges = [...changes];
        newChanges[index] = !newChanges[index];
        setChanges(newChanges);
    };

  return (
    <>
        <div className={style.create_wrapper}>
                    <div className={style.create_header}>
                        <span>
                            <h1>New Product</h1>
                            <h4>Create new product</h4>
                        </span>
                        <Link to="/products" className={style.back_button}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left me-2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                            Back to Product
                        </Link>
                    </div>

                    <form className={`form ${style.Product_data_table}`}>
                        <div className={style.Product_Information}>
                            <div className={style.header_info}>
                                <p>Product Information</p>
                                <span className={style.button_} onClick={() => handleDivClick(0)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down chevron-down-add"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
                            </div>

                            <div className={`${changes[0] ? "collaps" : ""} ${style.Product_data}`}>
                                <div className="flex-row">
                                    <div className="flex-column">
                                        <label>Product Name</label>
                                        <div className="inputForm">
                                            <input type="text" className="input" placeholder="Enter Product Name"/>
                                        </div>
                                    </div>
                                    <div className="flex-column">
                                        <label>Slug</label>
                                        <div className="inputForm">
                                            <input type="text" className="input" placeholder="Slug"/>
                                        </div>
                                    </div>
                                    <div className="flex-column">
                                        <label>SKU</label>
                                        <div className="inputForm">
                                            <input type="text" className="input" placeholder="SKU"/>
                                        </div>
                                    </div>
                                    <div className="flex-column">
                                        <label>Category</label>
                                        <div className="inputForm">
                                            <input type="text" className="input" placeholder="Choose"/>
                                        </div>
                                    </div>
                                    <div className="flex-column">
                                        <label>Sub Category</label>
                                        <div className="inputForm">
                                            <input type="text" className="input" placeholder="Choose"/>
                                        </div>
                                    </div>
                                    <div className="flex-column">
                                        <label>Sub Sub Category</label>
                                        <div className="inputForm">
                                            <input type="text" className="input" placeholder="Choose"/>
                                        </div>
                                    </div>
                                    <div className="flex-column">
                                        <label>Brand</label>
                                        <div className="inputForm">
                                            <input type="text" className="input" placeholder="Choose"/>
                                        </div>
                                    </div>
                                    <div className="flex-column">
                                        <label>Unit</label>
                                        <div className="inputForm">
                                            <input type="text" className="input" placeholder="Choose"/>
                                        </div>
                                    </div>
                                    <div className="flex-column">
                                        <label>Selling Typ</label>
                                        <div className="inputForm">
                                            <input type="text" className="input" placeholder="Choose"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-column" style={{width:"100%"}}>
                                        <label>Product Name</label>
                                            <textarea type="text" rows="10" cols="120" maxLength="200" mincols="120" placeholder="Enter Product Name"/>
                                        <label style={{fontSize:"14px", fontWeight:"400"}}>Minimum Character 60</label>
                                    </div>
                            </div>
                        </div>
                        <div className={style.Pricing_stock}>
                            <div className={style.header_info}>
                                    <p>Pricing and Stock</p>
                                    <span className={style.button_} onClick={() => handleDivClick(1)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down chevron-down-add"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
                            </div>
                            <div className={style.Option_wrapper}>

                            </div>
                            <div className={`${changes[1] ? "collaps" : ""} ${style.Products_Prices_Stocks}`}>
                                <div className="flex-row">
                                        <div className="flex-column">
                                            <label>Quantity</label>
                                            <div className="inputForm">
                                                <input type="text" className="input" placeholder="Quantity"/>
                                            </div>
                                        </div>
                                        <div className="flex-column">
                                            <label>Price</label>
                                            <div className="inputForm">
                                                <input type="text" className="input" placeholder="Price"/>
                                            </div>
                                        </div>
                                        <div className="flex-column">
                                            <label>Tax Type</label>
                                            <div className="inputForm">
                                                <input type="text" className="input" placeholder="SKU"/>
                                            </div>
                                        </div>
                                        <div className="flex-column">
                                            <label>Discount Type</label>
                                            <div className="inputForm">
                                                <input type="text" className="input" placeholder="Choose"/>
                                            </div>
                                        </div>
                                        <div className="flex-column">
                                            <label>Discount Value</label>
                                            <div className="inputForm">
                                                <input type="text" className="input" placeholder="Choose"/>
                                            </div>
                                        </div>
                                        <div className="flex-column">
                                            <label>Quantity Alert</label>
                                            <div className="inputForm">
                                                <input type="text" className="input" placeholder="14"/>
                                            </div>
                                        </div>
                                </div>
                            </div>

                        </div>
                        <div className={style.Image_Fields}>
                                <div className={style.header_info}>
                                    <p>Image</p>
                                    <span className={style.button_} onClick={() => handleDivClick(2)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down chevron-down-add"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
                                </div>
                                <div className={`${changes[2] ? "collaps" : ""} ${style.Image_Uploader}`}>
                                    <label className={style.custum_file_upload} for="file">
                                        <div className={style.icon}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle plus-down-add me-0"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                                        </div>
                                        <div className={style.text}>
                                            <span>Add Image</span>
                                            </div>
                                            <input type="file" id="file"/>
                                    </label>

                                </div>
                        </div>
                        <div className={style.Custom_Fields}>
                                <div className={style.header_info}>
                                    <p>Custom Fields</p>
                                    <span className={style.button_} onClick={() => handleDivClick(3)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down chevron-down-add"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
                                </div>
                                <div className={`${changes[3] ? "collaps" : ""} ${style.fields}`} >
                                    <div className="flex-row">
                                            <div className="flex-column">
                                                <label>Quantity Alert</label>
                                                <div className="inputForm">
                                                    <input type="text" className="input" placeholder="Quantity"/>
                                                </div>
                                            </div>
                                            <div className="flex-column">
                                                <label>Manufactured Data</label>
                                                <div className="inputForm">
                                                    <input type="text" className="input" placeholder="Price"/>
                                                </div>
                                            </div>
                                            <div className="flex-column">
                                                <label>Expiry On</label>
                                                <div className="inputForm">
                                                    <input type="text" className="input" placeholder="SKU"/>
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

export default CreateProduct


