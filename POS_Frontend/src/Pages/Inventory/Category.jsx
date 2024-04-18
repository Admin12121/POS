import React, { useState } from "react";
import style from "./style.module.scss";
import { Link } from "react-router-dom";

const Category = () => {
  const [hide, sethide] = useState(true);
  return (
    <>
      <div className={style.main_products_wrapper}>
        <div className={style.header_section}>
          <span className={style.text_con}>
            <h1>Expired Product</h1>
            <p>Manage your expired products</p>
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
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-printer feather-rotate-ccw"
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
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-rotate-ccw"
                >
                  <polyline points="1 4 1 10 7 10"></polyline>
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                </svg>
              </div>
            </span>
          </span>
        </div>
        <div className={style.table_section}>
          <div className={style.table_controls}>
            <div className={style.main_theme}>
              <span className={style.searchbar}>
                <input type="text" name="" placeholder="search" id="" />
              </span>
              <div className={style.advanced_search}>
                <div
                  className={style.quick_action}
                  onClick={() => sethide((prev) => !prev)}
                >
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
                    class="feather feather-filter filter-icon"
                  >
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                  </svg>
                </div>
                <div className={style.action_selector}>
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
                    class="feather feather-sliders info-img"
                  >
                    <line x1="4" y1="21" x2="4" y2="14"></line>
                    <line x1="4" y1="10" x2="4" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12" y2="3"></line>
                    <line x1="20" y1="21" x2="20" y2="16"></line>
                    <line x1="20" y1="12" x2="20" y2="3"></line>
                    <line x1="1" y1="14" x2="7" y2="14"></line>
                    <line x1="9" y1="8" x2="15" y2="8"></line>
                    <line x1="17" y1="16" x2="23" y2="16"></line>
                  </svg>
                  Sort by Date
                </div>
              </div>
            </div>
            <div className={style.hidden_theme} id={hide ? "hide" : ""}>
              <div className={style.action_bittons}>
                <div className={style.action_selector}>
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
                    class="feather feather-box info-img"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                  Choose Product
                  <span className={style.box_area}>
                    <b className={style.arrow_presentation}></b>
                  </span>
                </div>
                <div className={style.action_selector}>
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
                    class="feather feather-stop-circle info-img"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <rect x="9" y="9" width="6" height="6"></rect>
                  </svg>
                  Choose Category
                  <span className={style.box_area}>
                    <b className={style.arrow_presentation}></b>
                  </span>
                </div>
                <div className={style.action_selector}>
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
                    class="feather feather-stop-circle info-img"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <rect x="9" y="9" width="6" height="6"></rect>
                  </svg>
                  Choose Category
                  <span className={style.box_area}>
                    <b className={style.arrow_presentation}></b>
                  </span>
                </div>
              </div>
              <div className={style.action_button}>
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
                  class="feather feather-search"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                Search
              </div>
            </div>
          </div>
          <div className={style.main_t_table}>
            <div className={style.header}>
              <span className={style.exp_products}>
                <h4>#</h4>
                <h3>Products</h3>
                <h3>SKU</h3>
                <h3>Manufactured Date</h3>
                <h3>Expired Date</h3>
                <h4>Action</h4>
              </span>
            </div>
            <div className={style.list_of_product}>
              <span className={style.list}>
                <span className={style.list_exp_elements}>
                  <span>
                    <h1>1</h1>
                  </span>
                  <span>
                    <img
                      src="https://dreamspos.dreamstechnologies.com/html/template/assets/img/products/stock-img-01.png"
                      alt=""
                    />
                    <p>Nitro 7</p>
                  </span>
                  <span>
                    <h2>PT010</h2>
                  </span>
                  <span>
                    <h2>15 April 2024</h2>
                  </span>
                  <span>
                    <h2>12 May 2024</h2>
                  </span>
                  <span>
                    <span className={style.nav_item}>
                      <Link className={style.icon_links}>
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
                          class="feather feather-eye action-eye"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </Link>
                    </span>
                    <span className={style.nav_item}>
                      <Link className={style.icon_links}>
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
                          class="feather feather-edit"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </Link>
                    </span>
                    <span className={style.nav_item}>
                      <Link className={style.icon_links}>
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
                          class="feather feather-trash-2"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </Link>
                    </span>
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Category;
