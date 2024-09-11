import { useState, useEffect } from "react";
import style from './style.module.scss';
import DataTable from 'react-data-table-component';
import { useSubsubCategoryViewQuery, useAddsubsubCategoryMutation, useDeletesubsubCategoryMutation, useUpgradesubsubCategoryMutation } from "@/fetch_Api/service/user_Auth_Api";
import { useDashboardData } from '@/pages/dashboard/Dashboard';
import { toast } from 'sonner';
import { z } from 'zod';
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

const TableDataSchema = z.object({
  id: z.number(),
  subsubcategory: z.any(),
  subcategory: z.any(),
  createdby: z.any(),
  category: z.any(),
  image: z.string(),
  description: z.string(),
});

type TableData = z.infer<typeof TableDataSchema>;

const SubSubCategory = () => {
  const { userData } = useDashboardData();
  const [storeCode, setStoreCode] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); 
  const [search, setSearch] = useState('');
  const [filter, _setFilter] = useState('');
  const [loader, setLoader] = useState(false);   
  const { data, refetch } = useSubsubCategoryViewQuery({storeCode,  page, pageSize, search, filter},{skip:!storeCode});
  const [AddsubCategory] = useAddsubsubCategoryMutation();
  const [DeletesubCategory] = useDeletesubsubCategoryMutation();

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
  const [query, setQuery] = useState("");
  const [previewImage, setPreviewImage] = useState('');
  const [logfile, setLogFile] = useState<File | null>(null);
  const [id, setId] = useState<number | null>(null);
  const [drop, setDrop] = useState(false);
  const [update, setUpdate] = useState(true);
  const [storeData, setStoreData] = useState<any>('');
  const { data: SubCategoryData} = useSubsubCategoryViewQuery({storeCode, subcategory: true ,subcategorysearch: query},{skip: add});


  const updateButton = ({ id, subcategory }: { id: number, subcategory: string }) => {
    setPreviewImage('');
    setLogFile(null);
    setUpdate(prev => !prev);
    const itemToUpdate = data.results.find((item: any) => item.id === id);
    setQuery(subcategory);
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
    { name: "Sub Sub Category", selector: (row: any) => row.subsubcategory },
    { name: "Category", selector: (row: any) => row.category },
    { name: "Sub Category", selector: (row: any) => row.subcategory },
    { name: "Description", selector: (row: any) => row.description, sortable: true },
    { name: "Created by", selector: (row: any) => row.createdby, sortable: true },
    { name: "Action", selector: (row: any) => row.action, sortable: true },
  ];

  const table_data = data ? data.results.map((item: TableData) => ({
    id: item.id,
    subsubcategory: (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img src={item.image} style={{ height: "30px" }} />
        <p>{item.subsubcategory}</p>
      </div>
    ),
    category: item.category,
    subcategory: item.subcategory,
    description: item.description,
    createdby: item.createdby,
    action: (
      <span style={{ display: "flex", gap: "5px", alignItems: "center", width: "140px" }}>
        <span className="nav_item nav_edit">
          <span className={style.icon_links} onClick={() => updateButton({ id: item.id, subcategory: item.subcategory })}>
            <FiEdit/>
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
                This action cannot be undone. This will permanently delete this Sub Sub Category and remove it from servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-red-500 hover:bg-red-600">Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>        
      </span>
    ),
  })) : [];

  useEffect(() => {
    if (query !== "Choose Sub Category" && SubCategoryData && SubCategoryData.results) {
      const windowCategory = SubCategoryData.results.find((item: any) => item.subcategory === query);
      if (windowCategory) {
        setId(windowCategory.id);
      } else {
        setId(null);
      }
    }
  }, [query, data]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!logfile) {
      toast.success("Please Provide Category Image", {
        action: { label: 'X', onClick: () => toast.dismiss() },
      });
      return;
    }
    if (!id) {
      return "";
    }
    const formData = new FormData();
    formData.append('stor_code', storeCode);
    // formData.append('category', catid.toString());
    formData.append('subcategory', id.toString());
    formData.append('subsubcategory', e.currentTarget.elements.subsubcategory.value);
    formData.append('image', logfile);
    formData.append('description', e.currentTarget.elements.description.value);
    const res = await AddsubCategory({formData, storeCode});
    type FetchBaseQueryError = {
      status: number;
      data?: {
        error?: string;
      };
    };
    if (res.error) {
      const errorMessage = (res.error as FetchBaseQueryError).data?.error || 'An error occurred';
      toast.error(errorMessage, {
        action: {
          label: 'X',
          onClick: () => toast.dismiss(),
        },
      });
    }
    if (res.data) {
      setAdd(prev => !prev);
      e.target.reset();
      setLogFile(null);
      setPreviewImage('');
      refetch();
      toast.success(res.data.msg, {
        action: { label: 'X', onClick: () => toast.dismiss() },
      });
    }
  };

  const handleDelete = async (id: number) => {
    const res = await DeletesubCategory({storeCode, id});
    if (res.data) {
      toast.success(res.data.msg, {
        action: { label: 'X', onClick: () => toast.dismiss() },
      });
    } else {
      console.log(res.error);
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
            <h1>Sub Sub Category list</h1>
            <p>Manage your sub sub categories</p>
          </span>
          <span className={style.action_buttons}>
            <span className={style.small_button}>
              <div className={style.quick_action}>
                <img src="https://dreamspos.dreamstechnologies.com/html/template/assets/img/icons/pdf.svg" alt="pdf" />
              </div>
              <div className={style.quick_action}>
                <img src="https://dreamspos.dreamstechnologies.com/html/template/assets/img/icons/excel.svg" alt="excel" />
              </div>
              <div className={style.quick_action}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-printer feather-rotate-ccw">
                  <polyline points="6 9 6 2 18 2 18 9"></polyline>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                  <rect x="6" y="14" width="12" height="8"></rect>
                </svg>
              </div>
              <div className={style.quick_action} onClick={refetch}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-rotate-ccw">
                  <polyline points="1 4 1 10 7 10"></polyline>
                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                </svg>
              </div>
            </span>
            <div className={style.main_imp_button}>
              <span onClick={(e) => { setAdd(prev => !prev); e.preventDefault() }} className={style.import_export}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle me-2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                Add Sub Sub Category
              </span>
            </div>
          </span>
        </div>
        <div className={style.table_section}>
          <div className={style.table_controls}>
            <div className={style.main_theme}>
              <span className={style.searchbar}>
                <input type="text" name="" placeholder="search" id="" onChange={handleSearch}/>
                {loader && <svg id="Loader_search" viewBox="25 25 50 50">
                            <circle id="circle_line" r="20" cy="50" cx="50"></circle>
                          </svg>}                    
              </span>
              <div className={style.advanced_search}>
                <div className={style.quick_action} onClick={() => setHide(prev => !prev)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-filter filter-icon">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                  </svg>
                </div>
                <div className={style.action_selector}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-sliders info-img">
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-box info-img">
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-stop-circle info-img">
                    <circle cx="12" cy="12" r="10"></circle>
                    <rect x="9" y="9" width="6" height="6"></rect>
                  </svg>
                  Choose Category
                  <span className={style.box_area}>
                    <b className={style.arrow_presentation}></b>
                  </span>
                </div>
                <div className={style.action_selector}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-stop-circle info-img">
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search">
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
            fixedHeaderScrollHeight="79vh"
            paginationServer
            paginationTotalRows={data?.count || 0}
            onChangePage={(page) => setPage(page)}
            onChangeRowsPerPage={(newPageSize) => setPageSize(newPageSize)}             
          ></DataTable>
        </div>
      </div>
      {!add && <div className="uploading_form" style={{ display: `${add ? "none" : "flex"}` }}>
        <form action="" onSubmit={handleSubmit}>
          <div className="flex-row">
            <label>Create Sub Sub Category</label>
            <label className="close_btn" style={{ cursor: "pointer" }} onClick={(e) => { setAdd(prev => !prev); e.preventDefault() }}>x</label>
          </div>
          <div className="flex-row" style={{ position: "relative" }}>
            <label>Parent Sub Category <span className="important_mean_red">*</span></label>
            <div className="inputForm" onFocus={() => setTimeout(() => setDrop(true), 500)} onBlur={() => setTimeout(() => setDrop(false), 500)} style={{ borderColor: query && !id ? 'red' : 'green' }}>
              {/* <div className="input_form">{query}</div> */}
              <input 
                type="text" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                className="input_form" 
                placeholder="Search Parent Sub Category"
                style={{border:"none", outline: "none"}}
              />
              <svg style={{ rotate: "-90deg" }} width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.5 19C15.5 19 8.5 14.856 8.5 12C8.5 9.145 15.5 5 15.5 5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {drop && <div className="option_wrapper">
              {SubCategoryData && SubCategoryData.results.map(({ subcategory }: { subcategory: string }) => (
                <div className="drop-down" key={Math.random()}>
                  <span onClick={() => { setQuery(subcategory); setDrop(prev => !prev) }}>{subcategory}</span>
                </div>
              ))}
            </div>}
          </div>
          <div className="flex-row">
            <label>Sub Sub Category Name <span className="important_mean_red">*</span></label>
            <div className="inputForm">
              <input type="text" name="subsubcategory" className="input" placeholder="Enter Sub Sub Category" required />
            </div>
          </div>
          <div className="flex-column">
            <label>Image <span className="important_mean_red">*</span></label>
            <div className="Image_Uploader">
              <label className="custum-file-upload" htmlFor="file" style={{ backgroundImage: `${previewImage ? `url(${previewImage})` : ``}` }}>
                {!previewImage && (<>
                  <div className="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle plus-down-add me-0">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="16"></line>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
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
            <div className="inputForm" style={{ height: "100px" }}>
              <textarea name="description" style={{ minHeight: "unset" }} className="input" placeholder="Enter Sub Sub Category Description" required />
            </div>
          </div>
          <div className="flex-row">
            <span></span>
            <div className="button">
              <button onClick={(e) => { setAdd(prev => !prev); e.preventDefault() }}>Close</button>
              <button type="submit">Create Category</button>
            </div>
          </div>
        </form>
      </div>}
      {storeData && <UpdateSubCategory handleImage={handleImage} setPreviewImage={setPreviewImage} setLogFile={setLogFile} previewImage={previewImage} logfile={logfile} update={update} setDrop={setDrop}  storeData={storeData} drop={drop} setQuery={setQuery} query={query} storeCode={storeCode} setUpdate={setUpdate} setStoreData={setStoreData} refetch={refetch} />}
    </>
  );
};

interface UpdateSubCategoryProps {
  update: any;
  storeData: any;
  setDrop: any;
  setLogFile: any;
  setPreviewImage: any;
  handleImage: any;
  previewImage: any;
  logfile: any;
  setUpdate: any;
  drop: any;
  setStoreData: any;
  query: any;
  setQuery: any;
  storeCode: any;
  refetch: any;
}

const UpdateSubCategory = ({ update, storeData, setDrop, setLogFile, setPreviewImage, handleImage, previewImage, logfile, setUpdate, drop, setStoreData, query, setQuery, storeCode, refetch }: UpdateSubCategoryProps) => {
  const [UpdateSubCategory] = useUpgradesubsubCategoryMutation();
  const { data } = useSubsubCategoryViewQuery({storeCode, subcategory: true ,subcategorysearch: query});
  let id = storeData.id;
  const [catid, setCatId] = useState<number | null>(null);
  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setStoreData((prevData: any) => ({
      ...prevData,
      [name]: newValue
    }));
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    const NewFormData = new FormData();
    NewFormData.append('stor_code', storeCode.toString());
    NewFormData.append('subcategory', catid !== null ? catid.toString() : '');
    NewFormData.append('subsubcategory', storeData.subsubcategory);
    if (logfile) {
      NewFormData.append('image', logfile);
    }
    NewFormData.append('description', storeData.description);
    const res = await UpdateSubCategory({ NewFormData, id, storeCode });
    if (res.error) {
      console.log(res.error);
    }
    if (res.data) {
      setPreviewImage('');
      setLogFile(null);
      setUpdate((prev:any) => !prev);
      e.target.reset();
      refetch();
      toast.success(res.data.msg, {
        action: { label: 'X', onClick: () => toast.dismiss() },
      });
    }
  };

  useEffect(() => {
    if (query !== "Choose Sub Category" && data && data.results) {
      const windowCategory = data.results.find((item: any) => item.subcategory === query);
      if (windowCategory) {
        setCatId(windowCategory.id);
      } else {
        setCatId(null);
      }
    }
  }, [query, data]);

  return (
    <>
      <div className="uploading_form" style={{ display: `${update ? "none" : "flex"}` }}>
        <form action="" onSubmit={handleUpdate}>
          <div className="flex-row">
            <label>Create Sub Category</label>
            <label className="close_btn" style={{ cursor: "pointer" }} onClick={(e) => { setUpdate((prev:any) => !prev); e.preventDefault() }}>x</label>
          </div>
          <div className="flex-row" style={{ position: "relative" }}>
            <label>Parent Category</label>
            <div className="inputForm" onClick={() => setDrop((prev:any) => !prev)}>
              {/* <div className="input_form">{query}</div> */}
              <input 
                type="text" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                className="input_form" 
                placeholder="Search Parent Sub Category"
                style={{border:"none", outline: "none"}}
              />              
              <svg style={{ rotate: "-90deg" }} width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.5 19C15.5 19 8.5 14.856 8.5 12C8.5 9.145 15.5 5 15.5 5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {drop && <div className="option_wrapper">
              {data && data.results.map(({ subcategory }: { subcategory: string }) => (
                <div className="drop-down" key={Math.random()}>
                  <span onClick={() => { setQuery(subcategory); setDrop((prev:any) => !prev) }}>{subcategory}</span>
                </div>
              ))}
            </div>}
          </div>
          <div className="flex-row">
            <label>Category Name</label>
            <div className="inputForm">
              <input type="text" name="subsubcategory" className="input" value={storeData.subsubcategory} onChange={handleInputChange} placeholder="Enter Category" required />
            </div>
          </div>
          <div className="flex-column">
            <label>Image</label>
            <div className="Image_Uploader">
              <label className="custum-file-upload" htmlFor="file" style={{ backgroundImage: `${previewImage ? `url(${previewImage})` : `url(${storeData.image})`}` }}>
                {!previewImage || storeData.category_image && (<>
                  <div className="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle plus-down-add me-0">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="16"></line>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                  </div>
                  <div className="text">
                    <span>Add image</span>
                  </div>
                </>)}
                <input type="file" id="file" name="image" onChange={handleImage} />
              </label>
            </div>
          </div>
          <div className="flex-row">
            <label>Description</label>
            <div className="inputForm" style={{ height: "100px" }}>
              <textarea name="description" style={{ minHeight: "unset" }} value={storeData.description} onChange={handleInputChange} className="input" placeholder="Enter CategorySlug" required />
            </div>
          </div>
          <div className="flex-row">
            <span></span>
            <div className="button">
              <button onClick={(e) => { setUpdate((prev:any) => !prev); e.preventDefault() }}>Close</button>
              <button type="submit">Create Category</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default SubSubCategory;