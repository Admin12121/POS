import { useState, useEffect } from "react";
import style from '@/pages/Inventory/style.module.scss';
import { Link } from 'react-router-dom';
import "./style.scss";
import moment from 'moment';
import { useGetStaffUserQuery } from '@/fetch_Api/service/user_Auth_Api';
import { useDashboardData } from '@/pages/dashboard/Dashboard';

const Employee = () => {  
    const { userData } = useDashboardData();
    const [storeCode, setStoreCode] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const { data } = useGetStaffUserQuery({ storeCode, page, pageSize });

    useEffect(() => {
        if (userData) {
            setStoreCode(userData.stor.code);
        }
    }, [userData]);

    const [hide, setHide] = useState(true);
    const [buttonStates, setButtonStates] = useState<boolean[]>([]);
    const toggleButtonState = (index: number) => {
        const newButtonStates = [...buttonStates];
        newButtonStates[index] = !newButtonStates[index];
        newButtonStates.forEach((_state: any, i: number) => {
            if (i !== index) {
                newButtonStates[i] = false;
            }
        });
        setButtonStates(newButtonStates);
    };

    const handleNextPage = () => {
        if (data?.links?.next) {
            setPage(prev => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (data?.links?.previous && page > 1) {
            setPage(prev => prev - 1);
        }
    };

    return (
        <div className={style.main_products_wrapper}>
            <div className={style.header_section}>
                <span className={style.text_con}>
                    <h1>Employee</h1>
                    <p>Manage your employees</p>
                </span>
                <span className={style.action_buttons}>
                    <span className={style.small_button}>
                        <div className={style.quick_action}>
                            <img
                                src="https://dreamspos.dreamstechnologies.com/html/template/assets/img/icons/pdf.svg"
                                alt="pdf"
                            />
                        </div>
                        <div className={style.quick_action}>
                            <img
                                src="https://dreamspos.dreamstechnologies.com/html/template/assets/img/icons/excel.svg"
                                alt="excel"
                            />
                        </div>
                        <div className={style.quick_action}>
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
                                className="feather feather-printer feather-rotate-ccw"
                            >
                                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                                <rect x="6" y="14" width="12" height="8"></rect>
                            </svg>
                        </div>
                        <div className={style.quick_action}>
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
                        </div>
                    </span>
                    <div className={style.main_imp_button}>
                        <Link to="/register-employee" className={style.import_export}>
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
                                className="feather feather-plus-circle me-2"
                            >
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="16"></line>
                                <line x1="8" y1="12" x2="16" y2="12"></line>
                            </svg>
                            Add New Employee
                        </Link>
                    </div>
                </span>
            </div>
            <div className={style.table_section} style={{ height: "100%" }}>
                <div className={style.table_controls} style={{ border: "none" }}>
                    <div className={style.main_theme}>
                        <span className={style.searchbar}>
                            <input type="text" name="" placeholder="search" id="" />
                        </span>
                        <div className={style.advanced_search}>
                            <div className={style.quick_action} onClick={() => setHide(prev => !prev)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-filter filter-icon"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                            </div>
                            <div className={style.action_selector}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-sliders info-img"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                                Sort by Date
                            </div>
                        </div>
                    </div>
                    <div className={style.hidden_theme} id={hide ? "hide" : ""}>
                        <div className={style.action_bittons}>
                            <div className={style.action_selector}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-box info-img"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                                Choose Product
                                <span className={style.box_area}>
                                    <b className={style.arrow_presentation}></b>
                                </span>
                            </div>
                            <div className={style.action_selector}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-stop-circle info-img"><circle cx="12" cy="12" r="10"></circle><rect x="9" y="9" width="6" height="6"></rect></svg>
                                Choose Category
                                <span className={style.box_area}>
                                    <b className={style.arrow_presentation}></b>
                                </span>
                            </div>
                            <div className={style.action_selector}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-stop-circle info-img"><circle cx="12" cy="12" r="10"></circle><rect x="9" y="9" width="6" height="6"></rect></svg>
                                Choose Category
                                <span className={style.box_area}>
                                    <b className={style.arrow_presentation}></b>
                                </span>
                            </div>
                        </div>
                        <div className={style.action_button}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            Search
                        </div>
                    </div>
                </div>
            </div>
            <div className="employee_wrapper" style={{ justifyContent: `${data && data.results.length > 3 ? "space-between" : ""}` }}>
                {data && data.results.map(({ id, first_name, last_name, name, created_at, employee_id, employee_role, profile }: { email?: string, id: number, first_name: string, last_name: string, name: string, created_at: number, employee_id: string, employee_role: string, profile: string }, index: any) => (
                    <div key={id} className="employee_card">
                        <div className="header_">
                            <div className="action">
                                <span className="active">Active</span>
                                <span style={{ cursor: "pointer", display: "flex", alignItems: "center" }} onClick={() => toggleButtonState(index)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical feather-user"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                                </span>
                                {
                                    buttonStates[index] &&
                                    <span className="Editing_option">
                                        <p>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit info-img"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            Edit it</p>
                                        <p>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2 info-img"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                            Delete</p>
                                    </span>
                                }
                            </div>
                        </div>
                        <div className="employee_">
                            <img src={profile} alt={name} />
                            <h2>EMP ID : {employee_id}</h2>
                            <h1>{first_name} {last_name}</h1>
                            <h3>{employee_role}</h3>
                        </div>
                        <div className="employee_details">
                            <span>
                                <h1>Joined</h1>
                                <h1>{moment(created_at).format('YYYY-MM-DD')}</h1>
                            </span>
                            <span>
                                <h1>Department</h1>
                                <h1>{employee_role}</h1>
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <div className={style.pagination_controls}>
                <button onClick={handlePreviousPage} disabled={!data?.links?.previous}>Previous</button>
                <button onClick={handleNextPage} disabled={!data?.links?.next}>Next</button>
            </div>
        </div>
    );
};

export default Employee;