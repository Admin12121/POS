import { useEffect, useState } from "react";
import style from "./style.module.scss";
import "./style.scss";
import DataTable from "react-data-table-component";
import {
  useLowstockproductsViewQuery,
  useUpdatelowstockproductsMutation,
} from "../../fetch_Api/service/user_Auth_Api";
import { useDashboardData } from "@/pages/dashboard/Dashboard";
import { toast } from "sonner";
import { FiEdit } from "react-icons/fi";
import { z } from "zod";

interface LowStockData {
  id: number;
  product_name: string;
  sku: string;
  images: string;
  category: string;
  subcategory: string;
  subsubcategory: string;
  quantity: number;
  quantity_alert: number;
  brand: string;
  varient_data?: Variant[];
  single_product?: SingleProduct;
}

interface Variant {
  id: number;
  varient: { varient_category: string; name: string }[];
  quantity: number;
  quantity_alert: number;
}

interface SingleProduct {
  quantity: number;
  quantity_alert: number;
}

const LowStock = () => {
  const { userData } = useDashboardData();
  const [storeCode, setStoreCode] = useState("");
  const [hide, setHide] = useState(true);
  const [update, setUpdate] = useState(true);
  const [variantId, setVariantId] = useState<number | null>(null);
  const [storeData, setStoreData] = useState<LowStockData | null>(null);
  const [UpdateStock] = useUpdatelowstockproductsMutation();
  const { data, refetch } = useLowstockproductsViewQuery({ storeCode }, {skip: !storeCode});

  useEffect(() => {
    if (userData) {
      setStoreCode(userData.stor.code);
    }
  }, [userData]);

  useEffect(() => {
    if(data){
      refetch();
    }
  }, [storeCode, refetch]);

  const updateButton = (id?: number, variantId?: number) => {
    setUpdate(false);
    const itemToUpdate = data.find((item: LowStockData) => item.id === id);
    if (variantId) {
      setVariantId(variantId);
      const variantToUpdate = itemToUpdate.varient_data?.find(
        (v: Variant) => v.id === variantId
      );
      setStoreData({ ...itemToUpdate, ...variantToUpdate });
    } else {
      setVariantId(null);
      setStoreData({ ...itemToUpdate, single_product: itemToUpdate.single_product });
    }
  };

  const columns: any = [
    {
      name: "Product",
      selector: (row: { product: string }) => row.product,
      sortable: true,
      width: "15%",
    },
    {
      name: "Category",
      selector: (row: { category: string }) => row.category,
      sortable: true,
    },
    {
      name: "Sub Category",
      selector: (row: { subcategory: string }) => row.subcategory,
      sortable: true,
    },
    {
      name: "Sub SubCategory",
      selector: (row: { subsubcategory: string }) => row.subsubcategory,
      sortable: true,
    },
    {
      name: "Brand",
      selector: (row: { brand: string }) => row.brand,
      width: "10%",
      sortable: true,
    },
    {
      name: "Qty",
      selector: (row: { qty: number }) => row.qty,
      width: "80px",
      sortable: true,
    },
    {
      name: "Qty Alert",
      selector: (row: { quantity_alert: number }) => row.quantity_alert,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row: { action: any }) => row.action,
      sortable: true,
    },
  ];

  const table_data = data
    ? data.flatMap(
        ({
          id,
          product_name,
          varient_data,
          images,
          category,
          subcategory,
          subsubcategory,
          single_product,
          brand,
        }: LowStockData) => {
          if (!varient_data || varient_data.length === 0) {
            return [
              {
                id: id,
                product: (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <img src={images} style={{ height: "30px" }} />
                    <p>{product_name}</p>
                  </div>
                ),
                category: category,
                subcategory: subcategory,
                subsubcategory: subsubcategory,
                brand: brand,
                qty: single_product?.quantity,
                quantity_alert: single_product?.quantity_alert,
                action: (
                  <span
                    style={{
                      display: "flex",
                      gap: "5px",
                      alignItems: "center",
                      width: "140px",
                    }}
                    onClick={() => updateButton(id)}
                  >
                    <span className="nav_item nav_edit">
                      <span className={style.icon_links}>
                        <FiEdit />
                      </span>
                    </span>
                  </span>
                ),
              },
            ];
          } else {
            return varient_data.map((variant) => ({
              id: id,
              key: `product-${id}`,
              product: (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <img src={images} style={{ height: "30px" }} />
                  <p>
                    {product_name} -{" "}
                    {variant.varient.map(({ name }, index) => (
                      <span key={index}>{name}-</span>
                    ))}
                  </p>
                </div>
              ),
              category: category,
              subcategory: subcategory,
              subsubcategory: subsubcategory,
              brand: brand,
              qty: variant.quantity,
              quantity_alert: variant.quantity_alert,
              action: (
                <span
                  style={{
                    display: "flex",
                    gap: "5px",
                    alignItems: "center",
                    width: "140px",
                  }}
                  onClick={() => updateButton(id, variant.id)}
                >
                  <span className="nav_item nav_edit">
                    <span className={style.icon_links}>
                      <FiEdit />
                    </span>
                  </span>
                </span>
              ),
            }));
          }
        }
      )
    : [];

  const conditionalRowStyles = [
    {
      when: (row: { qty: number; quantity_alert: number }) => row.qty < row.quantity_alert,
      style: {
        backgroundColor: "rgba(242, 38, 19, 0.9)",
        color: "white",
        "&:hover": {
          cursor: "pointer",
        },
      },
    },
    {
      when: (row: { qty: number; quantity_alert: number }) => row.qty >= row.quantity_alert,
      style: {
        backgroundColor: "rgba(248, 148, 6, 0.9)",
        color: "white",
        "&:hover": {
          cursor: "pointer",
        },
      },
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStoreData((prevData) => {
      if (!prevData) return prevData; // If prevData is null, return null
  
      return {
        ...prevData,
        [name]: value,
      } as LowStockData;
    });
  };

  const schema = z.object({
    quantity: z.number().min(0, "Quantity must be a positive number"),
    quantity_alert: z.number().min(0, "Quantity alert must be a positive number"),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if(!storeData){
      return 
    }

    const actualData = {
      stor_code: storeCode,
      quantity: Number(formData.get("quantity")),
      quantity_alert: Number(formData.get("quantity_alert")),
    };

    const validation = schema.safeParse(actualData);
    if (!validation.success) {
      toast.error("Validation failed");
      return;
    }

    let res;
    if (!variantId && storeData?.single_product?.quantity) {
      const id = storeData.id;
      res = await UpdateStock({ actualData, id });
    } else {
      const id = storeData.id;
      res = await UpdateStock({ actualData, id, varient: variantId });
    }
    if(res.data) {
      setUpdate(true);
      setStoreData(null);
      refetch();
      console.log(data)
      toast.success(res.data.msg, {
        action: {
          label: "X",
          onClick: () => toast.dismiss(),
        },
      });
    }
  };

  return (
    <>
      <div className={style.main_products_wrapper}>
        <div className={style.header_section}>
          <span className={style.text_con}>
            <h1>Product List</h1>
            <p>Manage your products</p>
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
              <div className={style.quick_action} onClick={() => refetch()}>
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
                  onClick={() => setHide((prev) => !prev)}
                >
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
                    className="feather feather-filter filter-icon"
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
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-sliders info-img"
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
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-box info-img"
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
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-stop-circle info-img"
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
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-git-merge info-img"
                  >
                    <circle cx="18" cy="18" r="3"></circle>
                    <circle cx="6" cy="6" r="3"></circle>
                    <path d="M6 21V9a9 9 0 0 0 9 9"></path>
                  </svg>
                  Choose Sub Category
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
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-stop-circle info-img"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <rect x="9" y="9" width="6" height="6"></rect>
                  </svg>
                  All Brand
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
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-search"
                >
                                    <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                Search
              </div>
            </div>
          </div>
          <DataTable
            pagination
            columns={columns}
            data={table_data}
            selectableRows
            fixedHeader
            highlightOnHover
            pointerOnHover
            selectableRowsHighlight
            conditionalRowStyles={conditionalRowStyles}
            fixedHeaderScrollHeight="79vh"
          ></DataTable>
        </div>
      </div>
      {storeData && (
        <div
          className="Cutomer_form"
          style={{ display: `${update ? "none" : "flex"} ` }}
        >
          <form
            action=""
            onSubmit={handleSubmit}
            style={{ width: "450px", height: "500px" }}
          >
            <div
              className="close_button"
              onClick={(e) => {
                setUpdate(true);
                setStoreData(null); // Reset storeData
                e.preventDefault();
              }}
            >
              x
            </div>
            <span className="header_">Update Customer data</span>
            <div
              className="flex-row"
              style={{ justifyContent: "space-between", height: "100%" }}
            >
              <div className="flex-column" style={{ gap: 0, width: "100%" }}>
                <label>Product Name</label>
                <div className="inputForm">
                  <input
                    disabled
                    type="text"
                    style={{ cursor: "no-drop" }}
                    value={storeData.product_name}
                    className="input"
                  />
                </div>
              </div>
              <div className="flex-column" style={{ gap: 0 }}>
                <label>Category</label>
                <div className="inputForm">
                  <input
                    type="text"
                    style={{ cursor: "no-drop" }}
                    value={storeData.category}
                    disabled
                    className="input"
                  />
                </div>
              </div>
              <div className="flex-column" style={{ gap: 0 }}>
                <label>Sub Category</label>
                <div className="inputForm">
                  <input
                    type="text"
                    style={{ cursor: "no-drop" }}
                    value={storeData.subcategory}
                    disabled
                    className="input"
                  />
                </div>
              </div>
              <div className="flex-column" style={{ gap: 0 }}>
                <label>Sub Sub Category</label>
                <div className="inputForm">
                  <input
                    type="text"
                    style={{ cursor: "no-drop" }}
                    value={storeData.subsubcategory}
                    disabled
                    className="input"
                  />
                </div>
              </div>
              <div className="flex-column" style={{ gap: 0 }}>
                <label>Qty</label>
                <div className="inputForm">
                  <input
                    type="number"
                    value={storeData.quantity ?? storeData.single_product?.quantity}
                    onChange={handleInputChange}
                    className="input"
                    name="quantity"
                    placeholder="Qty"
                    required
                  />
                </div>
              </div>
              <div className="flex-column" style={{ gap: 0 }}>
                <label>Qty Alert</label>
                <div className="inputForm">
                  <input
                    type="number"
                    value={storeData.quantity_alert ?? storeData.single_product?.quantity_alert}
                    onChange={handleInputChange}
                    className="input"
                    name="quantity_alert"
                    placeholder="Quantity Alert"
                    required
                  />
                </div>
              </div>
              <div
                className="flex-row"
                style={{ justifyContent: "flex-end", gap: "10px" }}
              >
                <button
                  onClick={(e) => {
                    setUpdate(true);
                    setStoreData(null); // Reset storeData
                    e.preventDefault();
                  }}
                >
                  close
                </button>
                <button type="submit">Update Stock</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default LowStock;