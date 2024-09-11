import { useState, useEffect } from "react";
import style from './style.module.scss';
import moment from 'moment';
import { toast } from 'sonner';
import DataTable from 'react-data-table-component';
import { useDashboardData } from '@/pages/dashboard/Dashboard';
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { useCategoryViewQuery, useAddCategoryMutation, useUpgradeCategoryMutation, useDeleteCategoryMutation } from "@/fetch_Api/service/user_Auth_Api";
import { z } from 'zod';
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

const categorySchema = z.object({
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  status: z.boolean(),
  category_image: z.instanceof(File).refine(file => file instanceof File, "Category image is required")
});

interface CategoryProps {
  id: number;
  category: string;
  created_on: string;
  status: boolean;
  categoryslug: string;
  description: string;
  category_image: string;
}

const Category = () => {
  const { userData } = useDashboardData();
  const [storeCode, setStoreCode] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [filter, _setFilter] = useState('');
  const [loader, setLoader] = useState(false);
  const { data, refetch } = useCategoryViewQuery({ storeCode, page, pageSize, search, filter },{skip:!storeCode});
  

  useEffect(() => {
     if(data?.results.length > 0){
      refetch();
     }
  }, [storeCode, refetch]);


  useEffect(() => {
    if (userData) {
      setStoreCode(userData.stor.code);
    }
  }, [userData]);

  const [hide, setHide] = useState(true);
  const [add, setAdd] = useState(true);
  const [previewImage, setPreviewImage] = useState('');
  const [logfile, setLogFile] = useState<File | null>(null);
  const [AddCategory] = useAddCategoryMutation();
  const [DeleteCategory] = useDeleteCategoryMutation();
  const [update, setUpdate] = useState(true);
  const [storeData, setStoreData] = useState<any>('');

  const updateButton = (id: number) => {
    setPreviewImage('');
    setLogFile(null);
    setUpdate(prev => !prev);
    const itemToUpdate = data.results.filter(({ id: itemId }: { id: number }) => itemId === id)[0];
    setStoreData(itemToUpdate);
  };

  const handleImage = (e: any) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(selectedImage);
    }
    setLogFile(selectedImage);
  };

  const columns: any = [
    {
      name: "Category",
      selector: (row: any) => row.category,
    },
    {
      name: "Category slug",
      selector: (row: any) => row.categoryslug,
    },
    {
      name: "Description",
      selector: (row: any) => row.description,
    },
    {
      name: "Created on",
      selector: (row: any) => row.createdon,
      sortable: true
    },
    {
      name: "Status",
      selector: (row: any) => row.status,
      sortable: true
    },
    {
      name: "Action",
      selector: (row: any) => row.action,
      sortable: true
    },
  ];

  const table_data = data ? data.results.map(({ id, category, created_on, status, categoryslug, description, category_image }: CategoryProps) => ({
    id: id,
    category:
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img src={category_image} style={{ height: "30px" }} />
        <p>{category}</p>
      </div>,
    categoryslug: categoryslug,
    description: description,
    createdon: moment(created_on).format('YYYY-MM-DD'),
    status: `${status ? 'Active' : 'InActive'}`,
    action: <span style={{ display: "flex", gap: "5px", alignItems: "center", width: "140px" }}>
      <span className="nav_item nav_edit">
        <span className={style.icon_links} onClick={() => updateButton(id)}>
          <FiEdit />
        </span>
      </span>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-[36px] h-[36px] p-0" variant="outline"><MdDeleteOutline size={20} color="red"/></Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this Category and remove it from servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDelete(id)} className="bg-red-500 hover:bg-red-600">Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </span>
  })) : [];

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const statusCheckbox = e.currentTarget.elements.status;
    const status = statusCheckbox.checked;

    try {
      const validatedData = categorySchema.parse({
        category: e.currentTarget.elements.category.value,
        description: e.currentTarget.elements.description.value,
        status,
        category_image: logfile
      });

      formData.append('stor_code', storeCode);
      formData.append('category', validatedData.category);
      formData.append('category_image', validatedData.category_image);
      formData.append('description', validatedData.description);
      formData.append('status', validatedData.status ? 'true' : 'false');

      const res = await AddCategory({formData, storeCode});
      type FetchBaseQueryError = {
        status: number;
        data?: {
          error?: string;
          errors?: any;
        };
      };

      if (res && typeof res === 'object' && 'error' in res) {
        const errorData = (res.error as FetchBaseQueryError).data;
        let errorMessage = 'An error occurred';

        if (errorData) {
          if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.errors) {
            const firstErrorKey = Object.keys(errorData.errors)[0];
            errorMessage = errorData.errors[firstErrorKey][0];
          }
        }

        toast.error(errorMessage, {
          action: {
            label: 'X',
            onClick: () => toast.dismiss(),
          },
        });
      } else if (res.data) {
        setAdd(prev => !prev);
        setLogFile(null);
        setPreviewImage('');
        e.target.reset();
        refetch();
        toast.success(res.data.msg, {
          action: {
            label: 'X',
            onClick: () => toast.dismiss(),
          },
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => {
          toast.error(err.message, {
            action: {
              label: 'X',
              onClick: () => toast.dismiss(),
            },
          });
        });
      }
    }
  };

  const handleDelete = async (id: number) => {
    const res = await DeleteCategory({storeCode,id});
    type FetchBaseQueryError = {
      status: number;
      data?: {
        error?: string;
      };
    };
    if (res.data) {
      toast.success(res.data.msg, {
        action: {
          label: 'X',
          onClick: () => toast.dismiss(),
        },
      });
    } else {
      const errorMessage = (res.error as FetchBaseQueryError).data?.error || 'An error occurred';
      toast.error(errorMessage, {
        action: {
          label: 'X',
          onClick: () => toast.dismiss(),
        },
      });
    }
    refetch();
  };

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
      <div className={style.main_products_wrapper}>
        <div className={style.header_section}>
          <span className={style.text_con}>
            <h1>Category</h1>
            <p>Manage your categories</p>
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
              <div className={style.quick_action} onClick={refetch}>
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
              <span onClick={(e) => { setAdd(prev => !prev); e.preventDefault() }} className={style.import_export}>
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
                Add New Category
              </span>
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
            paginationServer
            paginationTotalRows={data?.count || 0}
            onChangePage={(page) => setPage(page)}
            onChangeRowsPerPage={(newPageSize) => setPageSize(newPageSize)}            
          ></DataTable>
        </div>
      </div>
      <div className="uploading_form" style={{ display: `${add ? "none" : "flex"}` }}>
        <form onSubmit={handleSubmit}>
          <div className="flex-row">
            <label>Create Category</label>
            <label className="close_btn" style={{ cursor: "pointer" }} onClick={(e) => { setAdd(prev => !prev); e.preventDefault(); setPreviewImage(''); setLogFile(null); }}>x</label>
          </div>
          <div className="flex-row">
            <label>Category <span className="important_mean_red">*</span></label>
            <div className="inputForm">
              <input type="text" className="input" name="category" placeholder="Enter Category" required />
            </div>
          </div>
          <div className="flex-column">
            <label>Image <span className="important_mean_red">*</span></label>
            <div className="Image_Uploader">
              <label className="custum-file-upload" htmlFor="file" style={{ backgroundImage: `${previewImage ? `url(${previewImage})` : ``}` }}>
                {!previewImage && (<>
                  <div className="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle plus-down-add me-0"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                  </div>
                  <div className="text">
                    <span>Add image</span>
                  </div>
                </>)}
                <input type="file" id="file" name="logo" onChange={handleImage} />
              </label>
            </div>
          </div>
          <div className="flex-row">
            <label>Description <span className="important_mean_red">*</span></label>
            <div className="inputForm">
              <input type="text" className="input" name="description" placeholder="Enter Description" required />
            </div>
          </div>
          <div className="flex-row">
            <label>Status</label>
            <label className="switch">
              <input type="checkbox" name="status" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
          <div className="flex-row">
            <span></span>
            <div className="button">
              <button onClick={(e) => { setAdd(prev => !prev); e.preventDefault(); setPreviewImage(''); setLogFile(null); }}>Close</button>
              <button type="submit">Create Category</button>
            </div>
          </div>
        </form>
      </div>
      {storeData && <UpdateCategory update={update} setPreviewImage={setPreviewImage} setLogFile={setLogFile} storeData={storeData} storeCode={storeCode} logfile={logfile} previewImage={previewImage} handleImage={handleImage} setUpdate={setUpdate} setStoreData={setStoreData} refetch={refetch} />}
    </>
  );
};

interface UpdateCategoryProps {
  update: boolean;
  storeData: any;
  setLogFile: any;
  setPreviewImage: any;
  setUpdate: any;
  previewImage: any;
  handleImage: any;
  setStoreData: any;
  storeCode: string;
  logfile: any;
  refetch: any;
}

const UpdateCategory = ({ update, storeData, setLogFile, setPreviewImage, setUpdate, previewImage, handleImage, setStoreData, storeCode, logfile, refetch }: UpdateCategoryProps) => {
  const [UpdateCategory] = useUpgradeCategoryMutation();
  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setStoreData((prevData: any) => ({
      ...prevData,
      [name]: newValue
    }));
  };

  let id = storeData.id;

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    const NewFormData = new FormData();
    NewFormData.append('store_code', storeCode);
    NewFormData.append('category', storeData.category);
    if (logfile) {
      NewFormData.append('category_image', logfile);
    }
    NewFormData.append('description', storeData.description);
    NewFormData.append('status', storeData.status ? 'true' : 'false');

    const res = await UpdateCategory({ NewFormData, id , storeCode});
    if (res.data) {
      setPreviewImage('');
      setLogFile(null);
      toast.success(res.data.msg, {
        action: {
          label: 'X',
          onClick: () => toast.dismiss(),
        },
      });
      setUpdate((prev: any) => !prev);
    } else {
      console.log(res.error);
    }
    refetch();
  };

  return (
    <div className="uploading_form" style={{ display: `${update ? "none" : "flex"}` }}>
      <form onSubmit={handleUpdate}>
        <div className="flex-row">
          <label>Update Category</label>
          <label className="close_btn" style={{ cursor: "pointer" }} onClick={(e: any) => { setUpdate((prev: any) => !prev); e.preventDefault(); }}>x</label>
        </div>
        <div className="flex-row">
          <label>Category</label>
          <div className="inputForm">
            <input type="text" className="input" value={storeData.category} onChange={handleInputChange} name="category" placeholder="Enter Category" required />
          </div>
        </div>
        <div className="flex-column">
          <label>Image</label>
          <div className="Image_Uploader">
            <label className="custum-file-upload" htmlFor="file" style={{ backgroundImage: `${previewImage ? `url(${previewImage})` : `url(${storeData.category_image})`}` }}>
              {!previewImage && storeData.category_image && (<>
                <div className="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle plus-down-add me-0"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                </div>
                <div className="text">
                  <span>Add image</span>
                </div>
              </>)}
              <input type="file" id="file" name="logo" onChange={handleImage} />
            </label>
          </div>
        </div>
        <div className="flex-row">
          <label>Description</label>
          <div className="inputForm">
            <input type="text" className="input" value={storeData.description} onChange={handleInputChange} name="description" placeholder="Enter Description" required />
          </div>
        </div>
        <div className="flex-row">
          <label>Status</label>
          <label className="switch">
            <input type="checkbox" checked={storeData.status} onChange={handleInputChange} name="status" />
            <span className="slider"></span>
          </label>
        </div>
        <div className="flex-row">
          <span></span>
          <div className="button">
            <button onClick={(e: any) => { setUpdate((prev: any) => !prev); e.preventDefault(); }}>Close</button>
            <button type="submit">Update Category</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Category;