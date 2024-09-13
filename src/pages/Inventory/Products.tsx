import { useEffect, useState } from "react";
import style from "./style.module.scss";
import "./style.scss";
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { useProductsViewQuery, useDeleteproductsMutation } from "@/fetch_Api/service/user_Auth_Api";
import { useDashboardData } from '@/pages/dashboard/Dashboard';
import { toast } from 'sonner';
import { Product, ProductRow , ProductVariantRow} from "@/pages/Inventory/productstype";
import jsPDF from "jspdf";
import {  utils, writeFile } from 'xlsx';
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"


const Products = () => {
  const { userData } = useDashboardData();
  const [storeCode, setStoreCode] = useState("");
  const [hide, sethide] = useState(true)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [filter, _setFilter] = useState('');
  const [loader, setLoader] = useState(false);
  const { data, refetch } = useProductsViewQuery({ storeCode,page,pageSize,search,filter }, {skip: !storeCode});
  const [DeletesubProduct] = useDeleteproductsMutation();

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

  const handleDelete = async (id: number) => {
    const res = await DeletesubProduct({ id });
    if (res.data) {
      toast.success(res.data.msg, {
        action: {
          label: 'X',
          onClick: () => toast.dismiss(),
        },
      });
    } else {
      console.log(res.error);
    }
    refetch();
  };

  const handleVariantDelete = async (id: number) => {
    const res = await DeletesubProduct({ varient: id });
    if (res.data) {
      toast.success(res.data.msg, {
        action: {
          label: 'X',
          onClick: () => toast.dismiss(),
        },
      });
    } else {
      console.log(res.error);
    }
    refetch();
  };

  const columns:any = [
    {
      name: "Product",
      selector: (row: ProductRow) => row.product,
      sortable: true,
      width: "15%",
    },
    {
      name: "SKU",
      selector: (row: ProductRow) => row.sku,
      width: "80px",
    },
    {
      name: "Category",
      selector: (row: ProductRow) => row.category,
      sortable: true,
      width: "10%",
    },
    {
      name: "Brand",
      selector: (row: ProductRow) => row.brand,
      width: "10%",
      sortable: true,
    },
    {
      name: "Price",
      selector: (row: ProductRow) => row.price,
      width: "100px",
      sortable: true,
    },
    {
      name: "Unit",
      selector: (row: ProductRow) => row.unit,
      width: "80px",
      sortable: true,
    },
    {
      name: "Qty",
      selector: (row: ProductRow) => row.qty,
      width: "80px",
      sortable: true,
    },
    {
      name: "Createdby",
      selector: (row: ProductRow) => row.createdby,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row: ProductRow) => row.action,
      sortable: true,
    },
  ];

  const expandablecolumns:any = [
    {
      name: "Product",
      selector: (row: ProductRow) => row.product,
      sortable: true,
      width: "23%",
    },
    {
      name: "SKU",
      selector: (row: ProductRow) => row.sku,
      width: "80px",
    },
    {
      name: "Category",
      selector: (row: ProductRow) => row.category,
      sortable: true,
      width: "10%",
    },
    {
      name: "Brand",
      selector: (row: ProductRow) => row.brand,
      width: "10%",
      sortable: true,
    },
    {
      name: "Price",
      selector: (row: ProductRow) => row.price,
      width: "100px",
      sortable: true,
    },
    {
      name: "Unit",
      selector: (row: ProductRow) => row.unit,
      width: "80px",
      sortable: true,
    },
    {
      name: "Qty",
      selector: (row: ProductRow) => row.qty,
      width: "80px",
      sortable: true,
    },
    {
      name: "Createdby",
      selector: (row: ProductRow) => row.createdby,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row: ProductRow) => row.action,
      sortable: true,
    },
  ];

  const table_data: ProductVariantRow[] = data
    ? data?.results.map(({ id, product_name, sku, images, category, createdby, brand, profile, single_product, varient_data }: Product) => {
        const firstVariant = varient_data && varient_data.length > 0 ? varient_data[0] : null;
        return {
          id,
          product: (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src={images} alt={product_name} style={{ height: "30px" }} />
              <p>{product_name}</p>
            </div>
          ),
          sku,
          category,
          brand,
          price: firstVariant ? `${firstVariant.price}` : `${single_product?.price || "N/A"}`,
          unit: single_product?.unit || null,
          qty: firstVariant ? firstVariant.quantity : single_product?.quantity || 0,
          createdby: (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Avatar className="w-10 h-10 rounded-md">
                    <AvatarImage src={profile || ""} alt={createdby}  className="object-cover"/>
                    <AvatarFallback>{createdby.charAt(0)}</AvatarFallback>
                  </Avatar>
              <p>{createdby}</p>
            </div>
          ),
          action: (
            <span style={{ display: "flex", gap: "5px", alignItems: "center", width: "140px" }}>
              <span className="nav_item nav_view">
                <Link to={`${product_name}/${id}`} className={style.icon_links}>
                  <MdOutlineRemoveRedEye />
                </Link>
              </span>
              <span className="nav_item nav_edit">
                <Link to={`update-products/${product_name}/${id}`} className={style.icon_links}>
                  <FiEdit />
                </Link>
              </span>
              <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="w-[36px] h-[36px] p-0" variant="outline"><MdDeleteOutline size={20} color="red"/></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this Product and remove it from servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(id)} className="bg-red-500 hover:bg-red-600">Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
              </AlertDialog>
            </span>
          ),
          variants: varient_data || [],
        };
      })
    : [];

    
  const ExpandedComponent = ({ data }: { data: ProductVariantRow }) => (
    <DataTable
      noTableHead
      columns={expandablecolumns}
      data={data.variants!.map(variant => ({
        id: variant.id,
        product: (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src={data.images} alt={variant.name || data.product_name} style={{ height: "30px" }} />
            <p>{variant.name || data.product_name}</p>
          </div>
        ),      
        sku: data.sku,
        category: data.category,
        brand: data.brand,
        price: `${variant.price}`,
        unit: variant?.unit,
        qty: variant.quantity,
        createdby: data.createdby,
        action: (
          <span style={{ display: "flex", gap: "5px", alignItems: "center", width: "140px" }}>
            <span className="nav_item nav_view">
              <Link to={`${data.product_name}/${data.id}`} className={style.icon_links}>
                <MdOutlineRemoveRedEye />
              </Link>
            </span>
            <span className="nav_item nav_edit">
              <Link to={`update-products/${data.product_name}/${data.id}`} className={style.icon_links}>
                <FiEdit />
              </Link>
            </span>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-[36px] h-[36px] p-0" variant="outline"><MdDeleteOutline size={20} color="red"/></Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this variant and remove it from servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={()=>handleVariantDelete(variant.id)} className="bg-red-500 hover:bg-red-600">Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </span>
        ),
      }))}
      noHeader
    />
  );
    
      const  handelExport = () =>{
        const ws = utils.json_to_sheet(data.results);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Data");
      writeFile(wb, "Products.xlsx");
    }

    
    const createHeaders = (keys:any) => {
      const result = [];
      
      for (let key of keys){
        result.push({
          id:key,
          name:key,
          prompt:key,
        });
      }
      return result;
    }
    const handelPdf = async () =>{
      const headers:any = createHeaders([
        'id',
        'product_name',
        'category',
        'subcategory',
        'brand',
        'quantity',
        'price'
      ])
      const doc = new jsPDF({orientation: "landscape"});
      const tabledata = data && data.results.map((row:any)=>({
        id: row.id.toString(),
        product_name: row.product_name.toString(),
        category: row.category.toString(),
        subcategory: row.subcategory.toString(),
        brand: row.brand.toString(),
        quantity: row.quantity.toString(),
        price: row.price.toString(),
      }));

      doc.table(1, 1, tabledata, headers, {autoSize : true});

      doc.save("products.pdf");
    }

    const handleSearch = (() => {
      let timeout: ReturnType<typeof setTimeout>;
      return (e: any) => {
        setLoader(true);
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          setSearch(e.target.value);
          setLoader(false);
        }, 1000);
      };
    })();    
  return (
    <>
    { <div className={style.main_products_wrapper}>
        <div className={style.header_section}>
          <span className={style.text_con}>
            <h1>Product List</h1>
            <p>Manage your products</p>
          </span>
          <span className={style.action_buttons}>
            <span className={style.small_button}>
                <div className={style.quick_action} onClick={()=>handelPdf()}>
                <img
                    src="https://dreamspos.dreamstechnologies.com/html/template/assets/img/icons/pdf.svg"
                    alt="pdf"
                />
                </div>
                <div className={style.quick_action} onClick={()=>handelExport()}>
                <img
                    src="https://dreamspos.dreamstechnologies.com/html/template/assets/img/icons/excel.svg"
                    alt="excel"
                />
                </div>
                <div className={style.quick_action} >
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
                <Link to="/create_product" className={style.import_export}>
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
                Add New Product
                </Link>
                <div className={style.import_export} id={style.invert_button}>
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
                    className="feather feather-download me-2"
                >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Import Product
                </div>
            </div>
          </span>
        </div>
        <div className={style.table_section}>
            <div className={style.table_controls}>
                <div className={style.main_theme}>
                    <span className={style.searchbar}>
                        <input type="text" name="" placeholder="search" id="" onChange={handleSearch} />
                        {loader && <svg id="Loader_search" viewBox="25 25 50 50">
                            <circle id="circle_line" r="20" cy="50" cx="50"></circle>
                          </svg>}
                    </span>
                    <div className={style.advanced_search}>
                        <div className={style.quick_action} onClick={()=>sethide(prev => !prev)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-filter filter-icon"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                        </div>
                        <div className={style.action_selector}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-sliders info-img"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                            Sort by Date
                        </div>
                    </div>
                </div>
                <div className={style.hidden_theme} id={ hide ? "hide" : ""}>
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-git-merge info-img"><circle cx="18" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><path d="M6 21V9a9 9 0 0 0 9 9"></path></svg>
                            Choose Sub Category
                            <span className={style.box_area}>
                                <b className={style.arrow_presentation}></b>
                            </span>
                        </div>
                        <div className={style.action_selector}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-stop-circle info-img"><circle cx="12" cy="12" r="10"></circle><rect x="9" y="9" width="6" height="6"></rect></svg>
                            All Brand
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
            <DataTable
              pagination
              columns={columns}
              data={table_data}
              selectableRows
              fixedHeader
              highlightOnHover
              pointerOnHover
              selectableRowsHighlight
              fixedHeaderScrollHeight="79vh"
              expandableRows
              expandableRowsComponent={ExpandedComponent}
              expandableRowDisabled={row => !row.variants || row.variants.length === 0} 
              paginationServer
              paginationTotalRows={data?.count || 0}
              onChangePage={(page) => setPage(page)}
              onChangeRowsPerPage={(newPageSize) => setPageSize(newPageSize)}                                    
            ></DataTable>
        </div>
      </div>}
    </>    
  );
};

export default Products;


