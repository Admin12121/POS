import style from "./style.module.scss";
import { Link } from "react-router-dom";
import Icon from "@/components/sidebar/icon";

interface SidebarProps {
  active: boolean;
  user: any;
}
const Sidebar: React.FC<SidebarProps> = ({active,user}) => {
 
  return (
    <>
      <div className={`${style.sidebar_wrapper}`} id={`${active ? style.mini_mini: ""}`}>
        <div className={style.sidebar_menu}>
          <div className={style.subment_wrapper}>
            <Link to="/" className={style.main_panal}>
              <Icon iconName="Dashboard" >
                Dashboard
              </Icon>
            </Link>
          </div>
          <div className={style.subment_wrapper}>
            <h6>Inventory</h6>
            <span className={style.model}>
              <Link to="/products" className={style.sidebar_main_link}>
                <Icon iconName="Product" >
                  Products 
                </Icon>
              </Link>
              <Link to="/create_product" className={style.sidebar_main_link}>
                <Icon iconName="Create" >
                  Create Products 
                </Icon>
              </Link>
              <Link to="/expired_product" className={style.sidebar_main_link}>
                <Icon iconName="Expired" >
                  Expired Products 
                </Icon>
              </Link>
              <Link to="/lowstock-products" className={style.sidebar_main_link}>
                <Icon iconName="Low" >
                  Low Stock Products 
                </Icon>
              </Link>
              <Link to="/category" className={style.sidebar_main_link}>
                <Icon iconName="Category" >
                  Category
                </Icon>
              </Link>
              <Link to='/sub-category' className={style.sidebar_main_link}>
                <Icon iconName="Sub-Category" >
                  Sub Category
                </Icon>
              </Link>
              <Link to='/sub-sub-category' className={style.sidebar_main_link}>
                <Icon iconName="Sub-Sub-Category" >
                  Sub Sub Category
                </Icon>
              </Link>
              <Link to="/brand" className={style.sidebar_main_link}>
                <Icon iconName="Brand" >
                  Brand
                </Icon>
              </Link>
            </span>
          </div>
          <div className={style.subment_wrapper}>
            <h6>Sales</h6>
            <span className={style.model}>
              <Link to="/sales" className={style.sidebar_main_link}>
                <Icon iconName="Sales" >
                  Sales 
                </Icon>
              </Link>
              <Link to="/invoice_report" className={style.sidebar_main_link}>
                <Icon iconName="Invoice" >
                  Invoice 
                </Icon>
              </Link>
              <Link to="/credit-details" className={style.sidebar_main_link}>
                <Icon iconName="Credits" >
                  Credits 
                </Icon>
              </Link>
              <Link to="/sales-return" className={style.sidebar_main_link}>
                <Icon iconName="Sales-Return" >
                  Sales Return 
                </Icon>
              </Link>
              <Link to="/quotation" className={style.sidebar_main_link}>
                <Icon iconName="Quotation" >
                  Quotation
                </Icon>
              </Link>
              <Link to="/pos" className={style.sidebar_main_link}>
                <Icon iconName="POS" >
                  POS
                </Icon>
              </Link>
            </span>
          </div>
          <div className={style.subment_wrapper}>
            <h6>Promo</h6>
            <span className={style.model}>
              <Link to="/coupons" className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Coupons </span>
              </Link>
            </span>
          </div>
          <div className={style.subment_wrapper}>
          <h6>Purchases</h6>
            <span className={style.model}>
              <Link to="/purchase" className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Purchase </span>
              </Link>
              <Link to="/purchase-order" className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Purchase Order</span>
              </Link>
              <Link to="/purchase-return" className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Purchase Return</span>
              </Link>
            </span>
          </div>
          <div className={style.subment_wrapper}>
          <h6>Finance & Accounts</h6>
            <span className={style.model}>
              <Link to="/expenses" className={style.sidebar_main_link}>
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
              <Link to="/supplier" className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Suppliers </span>
              </Link>
            </span>
          </div>
          { user &&  user.is_admin &&  <div className={style.subment_wrapper}>
          <h6>HRM</h6>
            <span className={style.model}>
              <Link to="/employee" className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Employees </span>
              </Link>
              <Link to="/department" className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Departments </span>
              </Link>
              <Link to="/attendence" className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Attendence </span>
              </Link>
              <Link to="/leave" className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Leaves </span>
              </Link>
              <Link to="/payroll" className={style.sidebar_main_link}>
                <span className={style.custom_panal}>Payroll </span>
              </Link>
            </span>
              </div>
          }
        </div>
      </div>
    </>
  );
};

export default Sidebar;
