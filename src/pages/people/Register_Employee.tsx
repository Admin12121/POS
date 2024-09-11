import { useState , useEffect} from 'react'
import style from "@/pages/Inventory/style.module.scss";
import { useNavigate, Link } from "react-router-dom";
import './style.scss'
import { z } from 'zod';
import {useRegisterUserMutation} from "@/fetch_Api/service/user_Auth_Api"
import { toast } from 'sonner';

import { useDashboardData } from '@/pages/dashboard/Dashboard';
const Register_Employee = () => {
    const navigate = useNavigate();
    const { userData } = useDashboardData();
    const [storeCode, setStoreCode] = useState("");
    const [RegisterUser, {isLoading}] = useRegisterUserMutation()
    const [changes, setChanges] = useState([false, false, false, false]);
    const [image, setImage] = useState()
    const [previewImage, setPreviewImage] = useState('');
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        empAddress: '',
        emergencyNo1: '',
        emergencyNo2: '',
        otherAddress: '',
        employee_role: '',
        country: '',
        city: '',
        zipcode: '',
        password: '',
        password2: ''
    });
    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        if (userData) {
            setStoreCode(userData.stor.code);
        }
    }, [userData]);

    const schema = z.object({
        first_name: z.string().min(1, "First Name is required"),
        last_name: z.string().min(1, "Last Name is required"),
        email: z.string().email("Invalid email address"),
        phone: z.string().min(10, "Contact Number is required"),
        dateOfBirth: z.string().min(1, "Date of Birth is required"),
        gender: z.string().min(1, "Gender is required"),
        empAddress: z.string().min(1, "Employee Address is required"),
        emergencyNo1: z.string().min(10, "Emergency No 1 is required"),
        emergencyNo2: z.string().optional(),
        otherAddress: z.string().min(1, "Other Address is required"),
        country: z.string().min(1, "Country is required"),
        employee_role: z.string().min(1, "Employee Role is required"),
        city: z.string().min(1, "City is required"),
        zipcode: z.string().min(1, "Zipcode is required"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        password2: z.string().min(6, "Confirm Password must be at least 6 characters"),
    }).refine(data => data.password === data.password2, {
        message: "Passwords don't match",
        path: ["password2"]
    });

    const handleDivClick = (index: any) => {
        const newChanges = [...changes];
        newChanges[index] = !newChanges[index];
        setChanges(newChanges);
    };

    const handleImage = (e: any) => {
        const selectedImage = e.target.files[0];

        if (selectedImage) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    setPreviewImage(reader.result.toString());
                }
            };
            reader.readAsDataURL(selectedImage);
            setImage(selectedImage)
        }
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const result = schema.safeParse(formData);
        setErrors({});
        if (result.success) {
            const data = new FormData();

            // Append form data fields to FormData object
            for (const key in formData) {
                data.append(key, formData[key as keyof typeof formData]);
            }
    
            // Append store code and other fixed fields
            data.append("stor_code", storeCode);
            data.append("tc", "true");
    
            // Append the profile image file if it's selected
            if (image) {
                data.append("profile", image);
            }
            const res = await RegisterUser(data);            
            type FetchBaseQueryError = {
                status: number;
                data?: {
                  errors?: any;
                };
              };
            if(res.data){
                toast.success("Employee Added Successfully")
                navigate('/employee', { replace: true });
            } else if((res.error as FetchBaseQueryError)?.data?.errors) {
                const apiErrors = (res.error as FetchBaseQueryError).data?.errors || {};
                const errorObject: any = {};
                for (const key in apiErrors) {
                    if (apiErrors.hasOwnProperty(key)) {
                        errorObject[key] = apiErrors[key][0];
                    }
                }
                setErrors(errorObject);
                const errorMessage = Object.values(errorObject).join(', ');
                toast.error(errorMessage);
            }
        } else {
            // Handle validation errors
            const errorObject: any = {};
            result.error.errors.forEach((error) => {
                errorObject[error.path[0]] = error.message;
            });
            setErrors(errorObject);
            console.log("Validation errors:", result.error.errors);
        }
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

                <form className={`form ${style.Product_data_table}`} onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className={style.Product_Information}>
                        <div className={style.header_info}>
                            <p>Employee Information</p>
                            <span className={style.button_} onClick={() => handleDivClick(0)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down chevron-down-add"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
                        </div>

                        <div className={`${changes[0] ? "collaps" : ""} ${style.Product_data}`}>
                            <div className="flex-column" style={{ width: "100%" }}>
                                <label>Profile <span className="important_mean_red">*</span></label>
                                <div className="Image_Uploader">
                                    <label className="custum-file-upload" htmlFor="file" style={{ backgroundImage: `${previewImage ? `url(${previewImage})` : ''}` }}>
                                        {!previewImage && (<>
                                            <div className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle plus-down-add me-0"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                                            </div>
                                            <div className="text">
                                                <span>Add Profile</span>
                                            </div>
                                        </>)}
                                        <input disabled={isLoading} type="file" id="file" name='profile' onChange={handleImage} required />
                                    </label>
                                </div>
                            </div>
                            <div className="flex-row">
                                <div className="flex-column">
                                    <label>First Name <span className="important_mean_red">*</span></label>
                                    <div className={`inputForm ${errors.first_name ? 'border-1 border-red-700' : ''}`}>
                                        <input disabled={Boolean(isLoading)} type="text" className="input" placeholder="First Name" name="first_name" value={formData.first_name} onChange={handleChange} />
                                    </div>
                                        {errors.firstName && <span className="error-message">{errors.first_name}</span>}
                                </div>
                                <div className="flex-column">
                                    <label>Last Name <span className="important_mean_red">*</span></label>
                                    <div className={`inputForm ${errors.last_name ? 'border-1 border-red-700' : ''}`}>
                                        <input disabled={Boolean(isLoading)} type="text" className="input" placeholder="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} />
                                    </div>
                                        {errors.last_name && <span className="error-message">{errors.last_name}</span>}
                                </div>
                                <div className="flex-column">
                                    <label>Email <span className="important_mean_red">*</span></label>
                                    <div className={`inputForm ${errors.email ? 'border-1 border-red-700' : ''}`}>
                                        <input disabled={Boolean(isLoading)} type="email" className="input" placeholder="email" name="email" value={formData.email} onChange={handleChange} />
                                    </div>
                                        {errors.email && <span className="error-message">{errors.email}</span>}
                                </div>
                                <div className="flex-column">
                                    <label>Contact Number <span className="important_mean_red">*</span></label>
                                    <div className={`inputForm ${errors.phone ? 'border-1 border-red-700' : ''}`}>
                                        <input disabled={Boolean(isLoading)} type="text" className="input" placeholder="+977 XXXXXXXXXX" name="phone" value={formData.phone} onChange={handleChange} />
                                    </div>
                                        {errors.phone && <span className="error-message">{errors.phone}</span>}
                                </div>
                                <div className="flex-column">
                                    <label>Emp Coded</label>
                                    <div className="inputForm">
                                        <input type="text" disabled className="input" placeholder="POS00X" />
                                    </div>
                                </div>
                                <div className="flex-column">
                                    <label>Date of Birth <span className="important_mean_red">*</span></label>
                                    <div className={`inputForm ${errors.dateOfBirth ? 'border-1 border-red-700' : ''}`}>
                                        <input disabled={Boolean(isLoading)} type="date" className="input" placeholder="Choose" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
                                    </div>
                                        {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
                                </div>
                                <div className="flex-column">
                                    <label>Gender <span className="important_mean_red">*</span></label>
                                    <div className={`inputForm ${errors.gender ? 'border-1 border-red-700' : ''}`}>
                                        <select disabled={Boolean(isLoading)} className="input" name="gender" value={formData.gender} onChange={handleChange}>
                                            <option value="">Choose</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                        {errors.gender && <span className="error-message">{errors.gender}</span>}
                                </div>
                                <div className="flex-column">
                                    <label>Address <span className="important_mean_red">*</span></label>
                                    <div className={`inputForm ${errors.empAddress ? 'border-1 border-red-700' : ''}`}>
                                        <input disabled={Boolean(isLoading)} type="text" className="input" placeholder="Choose" name="empAddress" value={formData.empAddress} onChange={handleChange} />
                                    </div>
                                        {errors.empAddress && <span className="error-message">{errors.empAddress}</span>}
                                </div>
                                <div className="flex-column">
                                    <label>Joining date</label>
                                    <div className="inputForm">
                                        <input type="date" disabled className="input" />
                                    </div>
                                </div>
                                <div className="flex-column">
                                    <label>Role <span className="important_mean_red">*</span></label>
                                    <div className={`inputForm ${errors.employee_role ? 'border-1 border-red-700' : ''}`}>
                                        <select disabled={Boolean(isLoading)} className="input" name="employee_role" value={formData.employee_role} onChange={handleChange}>
                                            <option value="">Choose</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Cashier">Cashier</option>
                                            <option value="Staff">Staff</option>
                                        </select>
                                    </div>
                                        {errors.gender && <span className="error-message">{errors.gender}</span>}
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
                                    <label>Emergency No 1 <span className="important_mean_red">*</span></label>
                                    <div className={`inputForm ${errors.emergencyNo1 ? 'border-1 border-red-700' : ''}`}>
                                        <input disabled={Boolean(isLoading)} type="text" className="input" placeholder="+977 XXXXXXXX" name="emergencyNo1" value={formData.emergencyNo1} onChange={handleChange} />
                                    </div>
                                        {errors.emergencyNo1 && <span className="error-message">{errors.emergencyNo1}</span>}
                                </div>
                                <div className="flex-column">
                                    <label>Emergency No 2 <span style={{color: "#808080"}}>{`(optional)`}</span></label>
                                    <div className={`inputForm ${errors.emergencyNo2 ? 'border-1 border-red-700' : ''}`}>
                                        <input disabled={Boolean(isLoading)} type="text" className="input" placeholder="+977 XXXXXXXX" name="emergencyNo2" value={formData.emergencyNo2} onChange={handleChange} />
                                    </div>
                                        {errors.emergencyNo2 && <span className="error-message">{errors.emergencyNo2}</span>}
                                </div>
                                <div className="flex-column">
                                    <label>Address <span className="important_mean_red">*</span></label>
                                    <div className={`inputForm ${errors.otherAddress ? 'border-1 border-red-700' : ''}`}>
                                        <input disabled={Boolean(isLoading)} type="text" className="input" placeholder="Address" name="otherAddress" value={formData.otherAddress} onChange={handleChange} />
                                    </div>
                                        {errors.otherAddress && <span className="error-message">{errors.otherAddress}</span>}
                                </div>
                                <div className="flex-column">
                                    <label>Country <span className="important_mean_red">*</span></label>
                                    <div className={`inputForm ${errors.country ? 'border-1 border-red-700' : ''}`}>
                                        <input disabled={Boolean(isLoading)} type="text" className="input" placeholder="Country" name="country" value={formData.country} onChange={handleChange} />
                                    </div>
                                        {errors.country && <span className="error-message">{errors.country}</span>}
                                </div>
                                <div className="flex-column">
                                    <label>City <span className="important_mean_red">*</span></label>
                                    <div className={`inputForm ${errors.city ? 'border-1 border-red-700' : ''}`}>
                                        <input disabled={Boolean(isLoading)} type="text" className="input" placeholder="City" name="city" value={formData.city} onChange={handleChange} />
                                    </div>
                                        {errors.city && <span className="error-message">{errors.city}</span>}
                                </div>
                                <div className="flex-column">
                                    <label>Zipcode <span className="important_mean_red">*</span></label>
                                    <div className={`inputForm ${errors.zipcode ? 'border-1 border-red-700' : ''}`}>
                                        <input disabled={Boolean(isLoading)} type="text" className="input" placeholder="517321" name="zipcode" value={formData.zipcode} onChange={handleChange} />
                                    </div>
                                        {errors.zipcode && <span className="error-message">{errors.zipcode}</span>}
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
                                    <label>Password <span className="important_mean_red">*</span></label>
                                    <div className={`inputForm ${errors.password ? 'border-1 border-red-700' : ''}`}>
                                        <input disabled={Boolean(isLoading)} type="password" className="input" placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
                                    </div>
                                        {errors.password && <span className="error-message">{errors.password}</span>}
                                </div>
                                <div className="flex-column">
                                    <label>Confirm Password  <span className="important_mean_red">*</span></label>
                                    <div className={`inputForm ${errors.password2 ? 'border-1 border-red-700' : ''}`}>
                                        <input disabled={Boolean(isLoading)} type="password" className="input" placeholder="Confirm Password" name="password2" value={formData.password2} onChange={handleChange} />
                                    </div>
                                        {errors.password2 && <span className="error-message">{errors.password2}</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={style.Submit_Button}>
                        <button type="button" className={style.Cancel}>
                            Cancel
                        </button>
                        <button type="submit" disabled={Boolean(isLoading)} className={style.Save}>
                            {isLoading ? <svg id="Loader_search" viewBox="25 25 50 50">
                            <circle id="circle_line" r="13" cy="50" cx="50"></circle>
                          </svg> : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}
export default Register_Employee