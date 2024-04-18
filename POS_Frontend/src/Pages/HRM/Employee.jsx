import "./style.scss";
import { Link } from "react-router-dom";
const tempEmployee = [
  {
    emp_id: 1,
    image: "https://i.pravatar.cc/48?u=118836",
    name: "Sumedh Bajracharya",
    role: "Front-end",
    joined_date: "23 Jul 2023",
    department: "IT",
    status: "Active",
  },
  {
    emp_id: 2,
    image: "https://i.pravatar.cc/48?u=118837",
    name: "John Doe",
    role: "Back-end",
    joined_date: "15 Aug 2023",
    department: "IT",
    status: Math.random() < 0.5 ? "Active" : "Inactive",
  },
  {
    emp_id: 3,
    image: "https://i.pravatar.cc/48?u=118838",
    name: "Jane Smith",
    role: "UI/UX Designer",
    joined_date: "10 Sep 2023",
    department: "Design",
    status: Math.random() < 0.5 ? "Active" : "Inactive",
  },
  // Add more entries here...
  {
    emp_id: 4,
    image: "https://i.pravatar.cc/48?u=118839",
    name: "Alice Johnson",
    role: "Software Engineer",
    joined_date: "5 Oct 2023",
    department: "Engineering",
    status: Math.random() < 0.5 ? "Active" : "Inactive",
  },
  {
    emp_id: 5,
    image: "https://i.pravatar.cc/48?u=118840",
    name: "Bob Williams",
    role: "Data Scientist",
    joined_date: "12 Nov 2023",
    department: "Research",
    status: Math.random() < 0.5 ? "Active" : "Inactive",
  },
  {
    emp_id: 6,
    image: "https://i.pravatar.cc/48?u=118841",
    name: "Ella Brown",
    role: "Front-end",
    joined_date: "20 Dec 2023",
    department: "IT",
    status: Math.random() < 0.5 ? "Active" : "Inactive",
  },
  {
    emp_id: 7,
    image: "https://i.pravatar.cc/48?u=118842",
    name: "Chris Lee",
    role: "DevOps Engineer",
    joined_date: "7 Jan 2024",
    department: "IT",
    status: Math.random() < 0.5 ? "Active" : "Inactive",
  },
  {
    emp_id: 8,
    image: "https://i.pravatar.cc/48?u=118843",
    name: "Emily Garcia",
    role: "Product Manager",
    joined_date: "14 Feb 2024",
    department: "Management",
    status: Math.random() < 0.5 ? "Active" : "Inactive",
  },
  {
    emp_id: 9,
    image: "https://i.pravatar.cc/48?u=118844",
    name: "David Martinez",
    role: "Software Engineer",
    joined_date: "22 Mar 2024",
    department: "Engineering",
    status: Math.random() < 0.5 ? "Active" : "Inactive",
  },
  {
    emp_id: 10,
    image: "https://i.pravatar.cc/48?u=118845",
    name: "Emma Taylor",
    role: "Data Analyst",
    joined_date: "3 Apr 2024",
    department: "Research",
    status: Math.random() < 0.5 ? "Active" : "Inactive",
  },
  {
    emp_id: 11,
    image: "https://i.pravatar.cc/48?u=118846",
    name: "Michael Brown",
    role: "Back-end",
    joined_date: "11 May 2024",
    department: "IT",
    status: Math.random() < 0.5 ? "Active" : "Inactive",
  },
  {
    emp_id: 12,
    image: "https://i.pravatar.cc/48?u=118847",
    name: "Sophia Rodriguez",
    role: "UI/UX Designer",
    joined_date: "19 Jun 2024",
    department: "Design",
    status: Math.random() < 0.5 ? "Active" : "Inactive",
  },
  {
    emp_id: 13,
    image: "https://i.pravatar.cc/48?u=118848",
    name: "Liam Martinez",
    role: "Front-end",
    joined_date: "27 Jul 2024",
    department: "IT",
    status: Math.random() < 0.5 ? "Active" : "Inactive",
  },
  {
    emp_id: 14,
    image: "https://i.pravatar.cc/48?u=118849",
    name: "Olivia Wilson",
    role: "Software Engineer",
    joined_date: "5 Aug 2024",
    department: "Engineering",
    status: Math.random() < 0.5 ? "Active" : "Inactive",
  },
  {
    emp_id: 15,
    image: "https://i.pravatar.cc/48?u=118850",
    name: "Noah Brown",
    role: "Data Scientist",
    joined_date: "12 Sep 2024",
    department: "Research",
    status: Math.random() < 0.5 ? "Active" : "Inactive",
  },
  {
    emp_id: 16,
    image: "https://i.pravatar.cc/48?u=118851",
    name: "Ava Smith",
    role: "Back-end",
    joined_date: "20 Oct 2024",
    department: "IT",
    status: Math.random() < 0.5 ? "Active" : "Inactive",
  },
];

const Employee = () => (
  <div className="employee_tab">
    <EmployeeHeader />
    {/* Search bar */}
    <EmployeeSearch />
    {/* Employees */}
    <EmployeeList />
  </div>
);

const EmployeeHeader = () => (
  <div className="employee_header">
    <div>
      <h2>Employees</h2>
      <p>Manage your employee</p>
    </div>
    <div className="employee_nav">
      <ul className="table-option">
        <li>
          <button>
            <img src="/public/assets/pdf.svg" alt="pdf" />
          </button>
        </li>
        <li>
          <button>
            <img src="/public/assets/excel.svg" alt="excel" />
          </button>
        </li>
        <li>
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-printer feather-rotate-ccw"
            >
              <polyline points="6 9 6 2 18 2 18 9"></polyline>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
              <rect x="6" y="14" width="12" height="8"></rect>
            </svg>
          </button>
        </li>
        <li>
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-rotate-ccw"
            >
              <polyline points="1 4 1 10 7 10"></polyline>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
            </svg>
          </button>
        </li>
      </ul>
      <div>
        <button className="btn-new-employee">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-plus-circle me-2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          <Link to="/add_employee">Add New Employee</Link>
        </button>
      </div>
    </div>
  </div>
);

const EmployeeSearch = () => (
  <div className="employee_search">
    <div className="total_employee">
      <div className="total_employee_right">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className=""
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>

        <h3>Total Employee</h3>
        <p>21</p>
      </div>
      <div className="search_bar">
        <button className="btn_search">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
        <input className="search" />
      </div>
    </div>

    <div>filters dropdown</div>
  </div>
);
const EmployeeList = () => (
  <div className="employee_list">
    {tempEmployee.map((employee, index) => (
      <EmployeeItem
        key={index}
        image={employee.image}
        emp_id={employee.emp_id}
        name={employee.name}
        joined_date={employee.joined_date}
        role={employee.role}
        department={employee.department}
        status={employee.status}
      />
    ))}
  </div>
);

const EmployeeItem = ({
  image,
  emp_id,
  name,
  joined_date,
  role,
  department,
  status,
}) => {
  const statusColor = status === "Active" ? "#4CAF50" : "#F44336";

  return (
    <div className="employee-card">
      <div className="employee-header">
        <input type="checkbox" />
        <div className="status-container">
          <p
            className="status"
            style={{ borderColor: statusColor, color: statusColor }}
          >
            {status}
          </p>
          <button className="options-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M12 15c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zM12 19c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zM12 11c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="employee-display">
        <img src={image} alt={`Mr. ${name}`} />
        <div className="employee-info">
          <strong>EMP ID: {emp_id}</strong>
          <h3>{name}</h3>
          <p>{role}</p>
        </div>
      </div>
      <div className="employee-details">
        <div>
          <p className="detail-label">Joined</p>
          <p className="detail">{joined_date}</p>
        </div>
        <div>
          <p className="detail-label">Department</p>
          <p className="detail">{department}</p>
        </div>
      </div>
    </div>
  );
};

export default Employee;
