import { Link } from "react-router-dom";
import "./AppHeader.scss";

const AppHeader = ({ title, para, btnName, path = "null" }) => {
  return (
    <div className="header">
      <div>
        <h2>{title}</h2>
        <p>{para}</p>
      </div>
      <div className="nav">
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
        <div className="btn-new">
          <Link to={`/${path}`}>
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
            <div>{btnName}</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
