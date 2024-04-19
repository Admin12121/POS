import { Link } from "react-router-dom";

const AddEmployee = () => (
  <div className="add_employ_tab">
    <AddEmployeeHeader />
    <AddEmployeeCard />
    <AddEmployeeFooter />
  </div>
);

const AddEmployeeHeader = () => {
  return (
    <div className="add_employee_header">
      <div>
        <h2>New Employee</h2>
        <p>Create new Employee</p>
      </div>
      <div className="add_employee_nav">
        <div>
          <div className="btn-new-employee">
            <Link to="/employee" className="back-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-arrow-left me-2"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>

              <div> Back to Employee List</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddEmployeeCard = () => {
  return (
    <div className="add_employee_card">
      <div className="card_title">
        <h6>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-info feather-edit"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          Employee Information
        </h6>
      </div>
      <div className="upload_profile">
        {/* This should change if profile is added */}
        <div className="profile_photo">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-plus-circle plus-down-add me-0"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <span>Profile Photo</span>
        </div>
        <div className="add_image">
          <button className="change_image" type="file">
            Change Image
          </button>
        </div>
      </div>
      <AddEmployeeInfo />
      <OtherInfo />
      <AddEmployeePassword />
    </div>
  );
};

const AddEmployeeInfo = () => {
  return (
    <div className="employee_info">
      <div className="row">
        <div className="column">
          <label>First Name</label> <br />
          <input type="text" />
        </div>
        <div className="column">
          <label>Last Name</label> <br />
          <input type="text" />
        </div>
        <div className="column">
          <label>Email</label> <br />
          <input type="email" />
        </div>
      </div>
      <div className="row">
        <div className="column">
          <label>Contact Number</label> <br />
          <input type="text" />
        </div>
        <div className="column">
          <label>Emp Code</label> <br />
          <input type="text" />
        </div>
        <div className="column">
          <label>Date of Birth</label> <br />
          <input type="date" />
        </div>
      </div>
      <div className="row">
        <div className="column">
          <label>Gender</label> <br />
          <select>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="column">
          <label>Nationality</label> <br />
          <input type="text" />
        </div>
        <div className="column">
          <label>Joining Date</label> <br />
          <input type="date" />
        </div>
      </div>
      <div className="row">
        <div className="column">
          <label>Shift</label> <br />
          <input type="text" />
        </div>
        <div className="column">
          <label>Department</label> <br />
          <input type="text" />
        </div>
        <div className="column">
          <label>Designation</label> <br />
          <input type="text" />
        </div>
      </div>
      <div className="row">
        <div className="column">
          <label>Blood Group</label> <br />
          <input type="text" />
        </div>
      </div>
    </div>
  );
};

const OtherInfo = () => {
  return (
    <div className="other_info">
      <div className="other_info_card">
        <h6>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-info feather-edit"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          Other Information
        </h6>
      </div>
      <div className="employee_other_info">
        <div className="row">
          <div className="column">
            <label>Emergency No 1</label> <br />
            <input type="text" />
          </div>
          <div className="column">
            <label>Emergency No 2</label>
            <br />
            <input type="text" />
          </div>
        </div>
        <div className="row">
          <div className="column">
            <label>Address</label>
            <br />
            <input type="text" />
          </div>
          <div className="column">
            <label>Country</label>
            <br />
            <input type="text" />
          </div>
        </div>
        <div className="row">
          <div className="column">
            <label>State</label>
            <br />
            <input type="text" />
          </div>
          <div className="column">
            <label>City</label>
            <br />
            <input type="text" />
          </div>
          <div className="column">
            <label>Zipcode</label>
            <br />
            <input type="text" />
          </div>
        </div>
      </div>
    </div>
  );
};

const AddEmployeePassword = () => {
  return (
    <div className="other_info">
      <div className="other_info_card">
        <h6>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-info feather-edit"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          Password
        </h6>
      </div>
      <div className="employee_other_info">
        <div className="row">
          <div className="column">
            <label>Password</label> <br />
            <input type="text" />
          </div>
          <div className="column">
            <label>Confirm Password</label>
            <br />
            <input type="text" />
          </div>
        </div>
      </div>
    </div>
  );
};

const AddEmployeeFooter = () => {
  return (
    <div className="add_employee_footer">
      <button className="cancel_btn">Cancel</button>
      <button className="save_btn">Save Product</button>
    </div>
  );
};

export default AddEmployee;
