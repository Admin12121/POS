import React from "react";
import style from "./style.module.scss";
import { Link } from "react-router-dom";
const Sidebar = ({active}) => {
  return (
    <>
      <div className={`${style.sidebar_wrapper}`} id={`${active ? style.mini_mini: ""}`}>
        <div className={style.sidebar_menu}>
          <div className={style.subment_wrapper}>
            <Link to="/" className={style.main_panal}>Dashboard</Link>
          </div>
          <div className={style.subment_wrapper}>
            <h6>Inventory</h6>
            <span className={style.model}>
              <Link to="/products" className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Products </span>
              </Link>
              <Link to="/create_product" className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Create Products </span>
              </Link>
              <Link to="/expired_product" className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Expired Products </span>
              </Link>
              <Link to="/category" className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Category</span>
              </Link>
              <Link to='/sub-category' className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Sub Category</span>
              </Link>
              <Link to="/brand" className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Brand</span>
              </Link>
              <Link className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Units</span>
              </Link>
            </span>
          </div>
          <div className={style.subment_wrapper}>
            <h6>Sales</h6>
            <span className={style.model}>
              <Link className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Sales </span>
              </Link>
              <Link className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Invoice </span>
              </Link>
              <Link className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Sales Return </span>
              </Link>
              <Link className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Quotation</span>
              </Link>
              <Link className={style.sidebar_main_link}>
                <span className={style.custom_panal}>POS</span>
              </Link>
            </span>
          </div>
          <div className={style.subment_wrapper}>
            <h6>Promo</h6>
            <span className={style.model}>
              <Link className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Coupons </span>
              </Link>
            </span>
          </div>
          <div className={style.subment_wrapper}>
          <h6>Purchases</h6>
            <span className={style.model}>
              <Link className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Purchase </span>
              </Link>
              <Link className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Purchase Order</span>
              </Link>
              <Link className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Purchase Return</span>
              </Link>
            </span>
          </div>
          <div className={style.subment_wrapper}>
          <h6>Finance & Accounts</h6>
            <span className={style.model}>
              <Link className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Expenses </span>
              </Link>
            </span>
          </div>
          <div className={style.subment_wrapper}>
          <h6>People</h6>
            <span className={style.model}>
              <Link to="/customer" className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Customer </span>
              </Link>
              <Link className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Suppliers </span>
              </Link>
            </span>
          </div>
          <div className={style.subment_wrapper}>
          <h6>HRM</h6>
            <span className={style.model}>
              <Link to="/employee" className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Employees </span>
              </Link>
              <Link className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Departments </span>
              </Link>
              <Link className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Attendence </span>
              </Link>
              <Link className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Leaves </span>
              </Link>
              <Link className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Payroll </span>
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
