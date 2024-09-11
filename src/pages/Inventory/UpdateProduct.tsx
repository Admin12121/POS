import { useState, useEffect, useRef } from "react";
import style from "./style.module.scss";
import { useNavigate, Link } from "react-router-dom";
import './style.scss';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useDashboardData } from '@/pages/dashboard/Dashboard';
import { useForeignkeyViewQuery, useGetupdateproductsViewQuery, useUpdateProductsMutation } from "@/fetch_Api/service/user_Auth_Api";
import TextQuill from "@/components/textQuill";
import MultiImageUploader from "@/pages/Inventory/MultiImageUploader";
import { MdDeleteOutline } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { Data, ProductData } from "@/pages/Inventory/updateproducttype";

interface Row {
  variantion: string;
  variantValues: { [key: string]: string };
  quantity_alert: string;
  quantity: string;
  price: string;
  v_exp_date: string | null;
  v_manuf_date: string | null;
  v_discount_type: string | null;
  v_discount_value: string;
}

const UpdateProduct = () => {
  const { id } = useParams();
  const { userData } = useDashboardData();
  const [storeCode, setStoreCode] = useState("");
  const [error, setError] = useState<any>("");
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { data, refetch } = useForeignkeyViewQuery(storeCode) as { data: Data; refetch: () => void };
  const { data: productData } = useGetupdateproductsViewQuery({ storeCode, id }) as { data: ProductData };
  const [updateProduct] = useUpdateProductsMutation();
  const [categoryquery, setCateQuery] = useState<{ id: number | null; category: string }>({ id: null, category: "Choose Category" });
  const [subcategoryquery, setSubQuery] = useState<{ id: number | null; subcategory: string }>({ id: null, subcategory: "Choose Sub Categor" });
  const [subsubcategoryquery, setSubSubQuery] = useState<{ id: number | null; subsubcategory: string }>({ id: null, subsubcategory: "Choose Sub Sub Categor" });
  const [brandquery, setBrandQuery] = useState<{ id: number | null; brand: string }>({ id: null, brand: "Choose Brand" });
  const [ubitquery, setUnitQuery] = useState<string>("Choose Units");
  const [discountquery, setDiscountQuery] = useState<string>("Choose Discount");
  const [taxquery, setTaxQuery] = useState<string>("Choose Tax Type");
  const [preimage, setPreImage] = useState<File[]>([]);
  const [description, setdescription] = useState('');
  const [changes, setChanges] = useState([false, false, false, false, false]);
  const [drop, setDrop] = useState([false, false, false, false, false, false, false, false, false]);
  const [previewImage, setPreviewImage] = useState('');
  const [_logfile, setLogFile] = useState<File | null>(null);
  const [variable, setVariable] = useState(true);
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [rowData, setRowData] = useState<Row[]>([]);

  const dis = [
    { type: "Cash" },
    { type: "Percentage" }
  ];
  const taxty = [
    { type: "Sales Tax" },
    { type: "Exclusive" }
  ];

  useEffect(() => {
    if (userData) {
      setStoreCode(userData.stor.code);
    }
  }, [userData]);

  useEffect(() => {
    if(subsubcategoryquery.id == null){
        setSubQuery({ id: null, subcategory: "Choose Sub Category" });
        setSubSubQuery({ id: null, subsubcategory: "Choose Sub Sub Category" });}
  }, [categoryquery]);

  useEffect(() => {
    if(subsubcategoryquery.id == null){
        setSubSubQuery({ id: null, subsubcategory: "Choose Sub Sub Category" });
    }
  }, [subcategoryquery]);


  const handleDivClick = (index: number) => {
    const newChanges = [...changes];
    newChanges[index] = !newChanges[index];
    setChanges(newChanges);
  };

  const handleDropdown = (index: number) => {
    const newChanges = [...changes];
    newChanges[index] = !newChanges[index];
    setDrop(newChanges);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedImage = e.target.files?.[0];
    if (selectedImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(selectedImage);
      setLogFile(selectedImage);
    }
  };

  useEffect(() => {
    if (productData) {
      setCateQuery({ id: productData.category.id, category: productData.category.category });
      setSubQuery({ id: productData.subcategory.id, subcategory: productData.subcategory.subcategory });
      setSubSubQuery({ id: productData.subsubcategory.id, subsubcategory: productData.subsubcategory.subsubcategory });
      setBrandQuery({ id: productData.brand.id, brand: productData.brand.brand });
      setUnitQuery(productData.single_product?.unit || productData.varient_data?.[0].unit || '');
      setdescription(productData.description);
      setVariable(!productData.varient_data);
  
      if (productData.varient_data) {
        const uniqueVariants = Array.from(new Set(productData.varient_data.flatMap(v => v.varient.map(va => va.varient_category))));
        setSelectedVariants(uniqueVariants);
  
        const rowsData = productData.varient_data.map(v => {
          const variantValues = v.varient.reduce((acc, cur) => {
            acc[cur.varient_category] = cur.name;
            return acc;
          }, {} as { [key: string]: string });
  
          return {
            id: v.id,
            variantion: v.varient.map(va => va.varient_category).join(', '),
            variantValues,
            quantity_alert: v.quantity_alert.toString(),
            quantity: v.quantity.toString(),
            price: v.price.toString(),
            v_exp_date: v.exp_date,
            v_manuf_date: v.manuf_date,
            v_discount_type: v.discount_type,
            v_discount_value: v.discount_value?.toString() || '',
          };
        });
  
        const distributedRows = [];
        for (let i = 0; i < rowsData.length; i++) {
          const row = rowsData[i];
          const variantion = uniqueVariants[i % uniqueVariants.length];
          distributedRows.push({
            ...row,
            variantion,
          });
        }
  
        setRows(distributedRows);
        setRowData(distributedRows);
      } else if (productData.single_product) {
        setUnitQuery(productData.single_product.unit!);
        setdescription(productData.description);
        setVariable(true);
      }
  
      setPreviewImage(productData.images);
    }
  }, [productData]);

  const handelSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('stor_code', storeCode);
    formData.append('id', id as string);
    formData.append('product_name', (e.currentTarget.elements.namedItem('product_name') as HTMLInputElement).value);
    formData.append('slug', (e.currentTarget.elements.namedItem('slug') as HTMLInputElement).value);
    formData.append('sku', (e.currentTarget.elements.namedItem('sku') as HTMLInputElement).value);
    formData.append('category', categoryquery.id?.toString() || '');
    formData.append('subcategory', subcategoryquery.id?.toString() || '');
    formData.append('subsubcategory', subsubcategoryquery.id?.toString() || '');
    formData.append('brand', brandquery.id?.toString() || '');
    formData.append('unit', ubitquery);
    formData.append('barcode', (e.currentTarget.elements.namedItem('barcode') as HTMLInputElement).value);
    formData.append('itemcode', (e.currentTarget.elements.namedItem('itemcode') as HTMLInputElement).value);
    formData.append('description', description);
    if (variable) {
      formData.append('single', 'true');
      formData.append('quantity', (e.currentTarget.elements.namedItem('quantity') as HTMLInputElement).value);
      formData.append('price', (e.currentTarget.elements.namedItem('price') as HTMLInputElement).value);
      formData.append('tax_type', taxquery);
      formData.append('discount_type', discountquery);
      formData.append('discount_value', (e.currentTarget.elements.namedItem('discount_value') as HTMLInputElement).value);
      formData.append('quantity_alert', (e.currentTarget.elements.namedItem('quantity_alert') as HTMLInputElement).value);
      formData.append('manuf_date', (e.currentTarget.elements.namedItem('manuf_date') as HTMLInputElement).value);
      formData.append('exp_date', (e.currentTarget.elements.namedItem('exp_date') as HTMLInputElement).value);
    } else {
      formData.append('variable', 'true');
      formData.append('rowData', JSON.stringify(rowData));
    }

    if (categoryquery.id && subcategoryquery.id && subsubcategoryquery.id && brandquery.id) {
      const res = await updateProduct({id, formData, storeCode});
      if (res.error && "data" in res.error) {
        setError(res.error.data);
      }
      if (res.data) {
        refetch();
        toast.success(res.data.msg, {
          action: {
            label: 'X',
            onClick: () => toast.dismiss(),
          },
        });
        navigate('/products', { replace: true });
      }
    } else {
      alert("fill the form correctly");
    }
  };

  useEffect(() => {
    refetch();
  }, [storeCode, refetch]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setDrop([false, false, false, false, false, false, false, false, false]);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const handleCheckboxChange = (variant: string) => {
    if (selectedVariants.includes(variant)) {
      const newSelectedVariants = selectedVariants.filter(v => v !== variant);
      setSelectedVariants(newSelectedVariants);
      const updatedRows = rows.filter(row => {
        if (typeof row.variantion === 'string') {
          const rowVariants = row.variantion.split(', ');
          return !rowVariants.includes(variant);
        }
        return true;
      });
      setRows(updatedRows);
    } else {
      setSelectedVariants([...selectedVariants, variant]);
      const newRow: Row = {
        variantion: variant,
        variantValues: selectedVariants.reduce((acc, cur) => {
          acc[cur] = '';
          return acc;
        }, {} as { [key: string]: string }),
        quantity_alert: '',
        quantity: '',
        price: '',
        v_exp_date: '',
        v_manuf_date: '',
        v_discount_type: '',
        v_discount_value: '',
      };
      setRows([...rows, newRow]);
      setRowData([...rowData, newRow]);
    }
  };

  const handleEditRow = (newVariants: string) => {
    if (selectedVariants.length === 0) return;
    const newRow: Row = {
      variantion: newVariants,
      variantValues: selectedVariants.reduce((acc, cur) => {
        acc[cur] = '';
        return acc;
      }, {} as { [key: string]: string }),
      quantity_alert: '',
      quantity: '',
      price: '',
      v_exp_date: '',
      v_manuf_date: '',
      v_discount_type: '',
      v_discount_value: '',
    };
    setRows([...rows, newRow]);
    setRowData([...rowData, newRow]);
  };

  const handleDeleteRow = (index: number) => {
    const updatedRows = [...rows];
    const deletedRow = updatedRows[index];
    const deletedRowVariants = typeof deletedRow.variantion === 'string' ? deletedRow.variantion.split(', ') : [];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
    setRowData(updatedRows);

    const variantsStillExist = updatedRows.some(row => {
      if (typeof row.variantion === 'string') {
        const rowVariants = row.variantion.split(', ');
        return rowVariants.some(variant => deletedRowVariants.includes(variant));
      }
      return false;
    });
    if (!variantsStillExist) {
      const newSelectedVariants = selectedVariants.filter(variant => !deletedRowVariants.includes(variant));
      setSelectedVariants(newSelectedVariants);
    }
  };

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedRows = [...rows];
    const currentRow = updatedRows[index];
    if (field in currentRow) {
      (currentRow as any)[field] = value;
    } else {
        currentRow.variantValues[field] = value;
    }
    setRows(updatedRows);
    setRowData(updatedRows);
  };


  return (
    <>
      <div className={style.create_wrapper}>
        <div className={style.create_header}>
          <span>
            <h1>Update {productData?.product_name || ""} Product</h1>
            <h4>Update {productData?.product_name || ""} Product</h4>
          </span>
          <Link to="/products" className={style.back_button}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left me-2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Back to Product
          </Link>
        </div>
        <form className={`form ${style.Product_data_table}`} onSubmit={handelSubmit} encType="multipart/form-data">
          <div className={style.Product_Information}>
            <div className={style.header_info}>
              <p>Product Information</p>
              <span className={style.button_} onClick={() => handleDivClick(0)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down chevron-down-add"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
            </div>

            <div className={`${changes[0] ? "collaps" : ""} ${style.Product_data}`}>
              <div className="flex-row">
                <div className="flex-column" >
                  <label>Product Name <span className="important_mean_red">*</span></label>
                  <div className="inputForm" style={{ border: `${error && error.errors.product_name ? "1px solid red" : ""}` }}>
                    <input type="text" name="product_name" className="input" placeholder="Enter Product Name" defaultValue={productData?.product_name || ''}/>
                  </div>
                </div>
                <div className="flex-column">
                  <label>Slug</label>
                  <div className="inputForm">
                    <input type="text" name="slug" className="input" placeholder="Slug" disabled defaultValue={productData?.slug || ''}/>
                  </div>
                </div>
                <div className="flex-column">
                  <label>SKU</label>
                  <div className="inputForm">
                    <input type="text" name="sku" className="input" placeholder="SKU" defaultValue={productData?.sku || ''}/>
                  </div>
                </div>
                <div className="flex-column" style={{ position: "relative" }}>
                  <label>Category <span className="important_mean_red">*</span></label>
                  <div className="inputForm" onClick={() => handleDropdown(0)} style={{ cursor: "pointer" }}>
                    <div className="input_form">{categoryquery.category}</div>
                    <svg style={{ rotate: "-90deg" }} width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.5 19C15.5 19 8.5 14.856 8.5 12C8.5 9.145 15.5 5 15.5 5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {drop[0] && <div className="option_wrapper" ref={menuRef}>
                    {data && data.categories.map(({ id, category }) => (
                      <div className="drop-down" key={id}>
                        <span onClick={() => { setCateQuery({ id, category });  setDrop(prev => {
                          const newDrop = [...prev];
                          newDrop[0] = !newDrop[0];
                          return newDrop;
                        }) }}>{category}</span>
                      </div>
                    ))}
                  </div>}
                </div>
                <div className="flex-column" style={{ position: "relative" }}>
                  <label>Sub Category <span className="important_mean_red">*</span></label>
                  <div className="inputForm" onClick={() => handleDropdown(1)} style={{ cursor: "pointer", background: `${categoryquery.id ? "" : "#fafafa"}` }}>
                    <div className="input_form">{subcategoryquery.subcategory}</div>
                    <svg style={{ rotate: "-90deg" }} width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.5 19C15.5 19 8.5 14.856 8.5 12C8.5 9.145 15.5 5 15.5 5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {categoryquery && drop[1] && <div className="option_wrapper" ref={menuRef} style={{ cursor: "pointer", background: `${subcategoryquery.id ? "" : "#fafafa"}` }}>
                    {data && data.subcategories.filter(subcategory => subcategory.category === categoryquery.id).map(({ id, subcategory }) => (
                      <div className="drop-down" key={id}>
                        <span onClick={() => { setSubQuery({ id, subcategory });  setDrop(prev => {
                          const newDrop = [...prev];
                          newDrop[1] = !newDrop[1];
                          return newDrop;
                        }) }}>{subcategory}</span>
                      </div>
                    ))}
                  </div>}
                </div>
                <div className="flex-column" style={{ position: "relative" }}>
                  <label>Sub Sub Category <span className="important_mean_red">*</span></label>
                  <div className="inputForm" onClick={() => handleDropdown(7)} style={{ cursor: "pointer", background: `${subcategoryquery.id ? "" : "#fafafa"}` }}>
                    <div className="input_form">{subsubcategoryquery.subsubcategory}</div>
                    <svg style={{ rotate: "-90deg" }} width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.5 19C15.5 19 8.5 14.856 8.5 12C8.5 9.145 15.5 5 15.5 5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {subcategoryquery && drop[7] && <div className="option_wrapper" ref={menuRef}>
                    {data && data.subsubcategories.filter(subsubcategory => subsubcategory.subcategory === subcategoryquery.id).map(({ id, subsubcategory }) => (
                      <div className="drop-down" key={id}>
                        <span onClick={() => { setSubSubQuery({ id, subsubcategory }); setDrop(prev => {
                          const newDrop = [...prev];
                          newDrop[7] = !newDrop[7];
                          return newDrop;
                        }) }}>{subsubcategory}</span>
                      </div>
                    ))}
                  </div>}
                </div>
                <div className="flex-column" style={{ position: "relative" }}>
                  <label>Brand <span className="important_mean_red">*</span></label>
                  <div className="inputForm" onClick={() => handleDropdown(2)}>
                    <div className="input_form">{brandquery.brand}</div>
                    <svg style={{ rotate: "-90deg" }} width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.5 19C15.5 19 8.5 14.856 8.5 12C8.5 9.145 15.5 5 15.5 5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {drop[2] && <div className="option_wrapper" ref={menuRef}>
                    {data && data.brand.map(({ id, brand }) => (
                      <div className="drop-down" key={id}>
                        <span onClick={() => { setBrandQuery({ id, brand }); setDrop(prev => {
                          const newDrop = [...prev];
                          newDrop[2] = !newDrop[2];
                          return newDrop;
                        }) }}>{brand}</span>
                      </div>
                    ))}
                  </div>}
                </div>
                <div className="flex-column" style={{ position: "relative" }}>
                  <label>Unit <span className="important_mean_red">*</span></label>
                  <div className="inputForm" onClick={() => handleDropdown(3)}>
                    <div className="input_form">{ubitquery}</div>
                    <svg style={{ rotate: "-90deg" }} width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.5 19C15.5 19 8.5 14.856 8.5 12C8.5 9.145 15.5 5 15.5 5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {drop[3] && <div className="option_wrapper" ref={menuRef}>
                    {data && data.unit_choices.map(({ unit }) => (
                      <div className="drop-down" key={unit}>
                        <span onClick={() => { setUnitQuery(unit); setDrop(prev => {
                          const newDrop = [...prev];
                          newDrop[3] = !newDrop[3];
                          return newDrop;
                        }) }}>{unit}</span>
                      </div>
                    ))}
                  </div>}
                </div>

                <div className="flex-row">
                  <div className="flex-column row-col">
                    <label>Barcode Symbology</label>
                    <div className="inputForm">
                      <input type="text" className="input" placeholder="Barcode Symbology" name="barcode" />
                    </div>
                  </div>
                  <div className="flex-column row-col">
                    <label>Item Code</label>
                    <div className="inputForm">
                      <input type="text" className="input" placeholder="Item Code" name="itemcode" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-column" style={{ width: "100%", height: "300px" }}>
                <label>Product Description <span className="important_mean_red">*</span></label>
                <TextQuill description={description} setdescription={setdescription} />
              </div>
            </div>
          </div>
          <div className={style.Pricing_stock}>
            <div className={style.header_info}>
              <p>Pricing and Stock</p>
              <span className={style.button_} onClick={() => handleDivClick(1)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down chevron-down-add"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
            </div>
            <div className={style.Option_wrapper}>
              <label>Product Type</label>
              <div className="flex-roww">
                <div className="flex-columnn">
                  <div className="content">
                    <label className="checkBox" onClick={() => setVariable(true)}>
                      <input type="checkbox" id="ch1" />
                      <div className={`transition ${variable ? "transitiondone" : ""}`}></div>
                    </label>
                  </div>
                  <label onClick={() => setVariable(true)} style={{ cursor: "pointer" }}> Single Product </label>
                </div>
                <div className="flex-columnn">
                  <div className="content">
                    <label className="checkBox" onClick={() => setVariable(false)}>
                      <input type="checkbox" id="ch1" />
                      <div className={`transition ${variable ? "" : "transitiondone"}`}></div>
                    </label>
                  </div>
                  <label onClick={() => setVariable(false)} style={{ cursor: "pointer" }}> Variable Product </label>
                </div>
              </div>
            </div>
            <div className={`${changes[1] ? "collaps" : ""} ${style.Products_Prices_Stocks}`}>
              {variable ? <div className="flex-row">
                <div className="flex-column">
                  <label>Quantity <span className="important_mean_red">*</span></label>
                  <div className="inputForm" style={{ border: `${error && error.errors.quantity ? "1px solid red" : ""}` }}>
                    <input type="number" className="input" name="quantity" min="0" step="1" placeholder="Quantity" defaultValue={productData?.single_product?.quantity || ''}/>
                  </div>
                </div>
                <div className="flex-column">
                  <label>Price <span className="important_mean_red">*</span></label>
                  <div className="inputForm" style={{ border: `${error && error.errors.price ? "1px solid red" : ""}` }}>
                    <input type="number" min="0" step="1" className="input" name="price" placeholder="Price" defaultValue={productData?.single_product?.price || ''}/>
                  </div>
                </div>
                <div className="flex-column" style={{ position: "relative" }}>
                  <label>Tax Type</label>
                  <div className="inputForm" onClick={() => handleDropdown(5)}>
                    <div className="input_form">{taxquery}</div>
                    <svg style={{ rotate: "-90deg" }} width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.5 19C15.5 19 8.5 14.856 8.5 12C8.5 9.145 15.5 5 15.5 5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {drop[5] && <div className="option_wrapper" ref={menuRef}>
                    {taxty.map(({ type }) => (
                      <div className="drop-down" key={type}>
                        <span onClick={() => { setTaxQuery(type); setDrop(prev => {
                          const newDrop = [...prev];
                          newDrop[5] = !newDrop[5];
                          return newDrop;
                        }) }}>{type}</span>
                      </div>
                    ))}
                  </div>}
                </div>
                <div className="flex-column" style={{ position: "relative" }}>
                  <label>Discount Type</label>
                  <div className="inputForm" onClick={() => handleDropdown(4)}>
                    <div className="input_form">{discountquery}</div>
                    <svg style={{ rotate: "-90deg" }} width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.5 19C15.5 19 8.5 14.856 8.5 12C8.5 9.145 15.5 5 15.5 5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {drop[4] && <div className="option_wrapper" ref={menuRef}>
                    {dis.map(({ type }) => (
                      <div className="drop-down" key={type}>
                        <span onClick={() => { setDiscountQuery(type); setDrop(prev => {
                          const newDrop = [...prev];
                          newDrop[4] = !newDrop[4];
                          return newDrop;
                        }) }}>{type}</span>
                      </div>
                    ))}
                  </div>}
                </div>
                <div className="flex-column">
                  <label>Discount Value</label>
                  <div className="inputForm">
                    <input type="number" min="0" step="1" className="input" name="discount_value" placeholder="10" defaultValue={productData?.single_product?.discount_value || ''}/>
                  </div>
                </div>
                <div className="flex-row">
                <div className="flex-column">
                  <label>Quantity Alert <span className="important_mean_red">*</span></label>
                  <div className="inputForm">
                    <input type="number" min="0" step="1" className="input" name="quantity_alert" placeholder="Quantity" defaultValue={productData?.single_product?.quantity_alert || ''}/>
                  </div>
                </div>
                <div className="flex-column">
                  <label>Manufactured Date <span className="important_mean_red">*</span></label>
                  <div className="inputForm">
                    <input type="date" className="input" name="manuf_date" style={{ padding: "10px" }} defaultValue={productData?.single_product?.manuf_date || ''}/>
                  </div>
                </div>
                <div className="flex-column">
                  <label>Expiry On</label>
                  <div className="inputForm">
                    <input type="date" className="input" name="exp_date" style={{ padding: "10px" }} defaultValue={productData?.single_product?.exp_date || ''}/>
                  </div>
                </div>
              </div>
              </div> :
                <>
                  <div className="flex-column" style={{ position: "relative" }}>
                    <div className="inputForm" onClick={() => handleDropdown(8)} style={{ cursor: "pointer", padding: "5px" }}>
                      <div className="input_form"><div style={{ display: "flex", gap: "5px" }}>{!selectedVariants.length ? "Choose Varient" : selectedVariants.map((vae) => (<p style={{ background: "rgb(237 241 254)", borderRadius: "7px", padding: "8px 15px" }} key={vae}>{vae} <span className="close_tab" onClick={() => handleCheckboxChange(vae)}>×</span></p>))}</div></div>
                      <svg style={{ rotate: "-90deg" }} width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.5 19C15.5 19 8.5 14.856 8.5 12C8.5 9.145 15.5 5 15.5 5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    {drop[8] && <div className="option_wrapper" style={{ top: "60px" }} ref={menuRef}>
                      {data && data.varient_category.map(({ varient }) => (
                        <div className="drop-down" style={{ background: `${selectedVariants.includes(varient) ? "var(--primary-color)" : " "}`, cursor: `${selectedVariants.includes(varient) ? "no-drop" : "pointer"}`, color: `${selectedVariants.includes(varient) ? "#fff" : "#000"}` }} key={varient}>
                          <span onClick={() => { !selectedVariants.includes(varient) && handleCheckboxChange(varient); setDrop(prev => {
                            const newDrop = [...prev];
                            newDrop[8] = !newDrop[8];
                            return newDrop;
                          }) }}>{varient}</span>
                        </div>
                      ))}
                    </div>}
                  </div>
                  <div className="taable_wrapper">
                  {selectedVariants.length > 0 && <table className="table-borderlesss w-100 table-fit">
                      <thead>
                        <tr>
                          <th>Variantion</th>
                          {selectedVariants.map(variant => (
                            <th key={variant}>{variant}</th>
                          ))}
                          <th>Quantity</th>
                          <th>Quantity Alert</th>
                          <th>Price</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row, index) => (
                        <tr key={index}>
                          <td>
                            <div className="flex-column">
                              <div className="inputForm">
                                <input type="text" className="input" name="variantion" value={row.variantion} placeholder="Variantion" />
                              </div>
                                <div style={{height:"42px"}}>
                                </div>
                            </div>
                          </td>
                          {selectedVariants.map(variant => (
                            <td key={variant}>
                              <div className="flex-column">
                                <div className="inputForm">
                                  <input type="text" className="input" name="variantValues" value={row.variantValues[variant]} placeholder={`Variant Value for ${variant}`} onChange={(e) => handleInputChange(index, variant, e.target.value)} />
                                </div>
                                <div style={{height:"42px"}}>
                                </div>
                              
                              </div>
                            </td>
                          ))}
                          <td>
                            <div className="flex-column">
                              <div className="inputForm">
                                <input type="number" min="0" step="1" className="input" name="quantity_alert" value={row.quantity_alert} onChange={(e) => handleInputChange(index, 'quantity_alert', e.target.value)} placeholder="Quantity" />
                              </div>
                                <div className="inputForm">
                                  <input type="text" className="input" name="v_discount_type" value={row.v_discount_type || ''} placeholder="Discount type" onChange={(e) => handleInputChange(index, 'v_discount_type', e.target.value)}/>
                                </div>
                            </div>
                          </td>
                          <td>
                            <div className="flex-column">
                              <div className="inputForm">
                                <input type="number" min="0" step="1" className="input" name="quantity" value={row.quantity} onChange={(e) => handleInputChange(index, 'quantity', e.target.value)} placeholder="Quantity" />
                              </div>
                                <div className="inputForm">
                                  <input type="number" min="0" step="1" className="input" value={row.v_discount_value} name="v_discount_value" placeholder="Discount value" onChange={(e) => handleInputChange(index, 'v_discount_value', e.target.value)}/>
                                </div>
                            </div>
                          </td>
                          <td>
                            <div className="flex-column">
                              <div className="inputForm">
                                <input type="number" min="0" step="1" className="input" name="price" value={row.price} onChange={(e) => handleInputChange(index, 'price', e.target.value)} placeholder="Price" />
                              </div>
                                <div className="inputForm">
                                  <input type="date" className="input" name="v_manuf_date" value={row.v_manuf_date || ''} placeholder="Manufactured Date" onChange={(e) => handleInputChange(index, 'v_manuf_date', e.target.value)}/>
                                </div>
                            </div>
                          </td>
                          <td className="action_button">
                            <div className="flex-column">
                            <div className="flex-row" style={{gap:"5px", flexWrap:"nowrap"}}>
                              <span className="nav_item nav_edit">
                                <span className={style.icon_links} onClick={() => { handleEditRow(row.variantion) }}>
                                  <IoIosAdd size={22}/>
                                </span>
                              </span>
                              <span className="nav_item nav_delete">
                                <span className={style.icon_links} onClick={() => { handleDeleteRow(index) }}>
                                  <MdDeleteOutline size={18}/>
                                </span>
                              </span>
                            </div>
                                <div className="inputForm" style={{height:"42px", top:"5px", position:"relative"}}>
                                    <input type="date" className="input" name="v_exp_date" value={row.v_exp_date || ''} placeholder="Expiry Date" onChange={(e) => handleInputChange(index, 'v_exp_date', e.target.value)}/>
                                </div>
                            </div>
                          </td>
                        </tr>
                        ))}
                      </tbody>
                    </table>}
                  </div>
                </>}
            </div>
          </div>
          <div className={style.Image_Fields}>
            <div className={style.header_info}>
              <p>Image <span className="important_mean_red">*</span></p>
              <span className={style.button_} onClick={() => handleDivClick(2)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down chevron-down-add"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
            </div>
            <div className={`${changes[2] ? "collaps" : ""} ${style.Image_Uploader}`}>
              <label className={style.custum_file_upload} htmlFor="file" style={{ backgroundImage: `${previewImage ? `url(${previewImage})` : ''}`, border: `${error && error.errors.images ? "1px solid red" : ""}` }}>
                {!previewImage && (<>
                  <div className={style.icon}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle plus-down-add me-0"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                  </div>
                  <div className={style.text}>
                    <span>Add Image</span>
                  </div>
                </>)}
                <input type="file" id="file" name="product_image" onChange={(e) => handleImage(e)} />
              </label>

              <MultiImageUploader images={preimage} setImages={setPreImage} />
            </div>
          </div>
          <div className={style.Submit_Button}>
            <button className={style.Cancel}>
              Cancel
            </button>
            <button type="submit" className={style.Save}>
              Update
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateProduct;