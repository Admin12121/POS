import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "@/fetch_Api/service/localStorageServices";

export const userAuthapi = createApi({
  reducerPath: "userAuthapi",
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_KEY_BACKEND_DOMAIN}/` }),
  endpoints: (builder) => ({
    notification: builder.query({
      query: () => {
        const {access_token} = getToken();
        return {
          url: "notification/",
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    registerUser: builder.mutation({
      query: (user) => {
        const {access_token} = getToken();
        return {
          url: "accounts/user_register/",
          method: "POST",
          body: user,
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    registerAdmin: builder.mutation({
      query: (user) => {
        return {
          url: "accounts/admin_register/",
          method: "POST",
          body: user,
          headers: {
            "Content-type": "application/json",
          },
        };
      },
    }),
    loginUser: builder.mutation({
      query: (user) => {
        return {
          url: "accounts/login/",
          method: "POST",
          body: user,
          headers: {
            "Content-type": "application/json",
          },
        };
      },
    }),
    activeUser: builder.mutation({
      query: (user) => {
        return {
          url: "accounts/activate/",
          method: "POST",
          body: user,
          headers: {
            "Content-type": "application/json",
          },
        };
      },
    }),
    resendOtp: builder.mutation({
      query: (user) => {
        return {
          url: "accounts/resend-otp/",
          method: "POST",
          body: user,
          headers: {
            "Content-type": "application/json",
          },
        };
      },
    }),
    checkActiveUser: builder.mutation({
      query: (user) => {
        return {
          url: "accounts/check-active-user/",
          method: "POST",
          body: user,
          headers: {
            "Content-type": "application/json",
          },
        };
      },
    }),
    getLoggedUser: builder.query({
      query: () => {
        const {access_token} = getToken();
        return {
          url: "accounts/profile/",
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    getUserProfile: builder.query({
      query: ({  username }) => {
        const  { access_token }  = getToken();
        return {
          url: `accounts/users/?name=${username}`,
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    updateUserProfile: builder.mutation({
      query: ({ NewFormData, id }) => {
        const  { access_token }  = getToken();
        return {
          url: `accounts/profile/?id=${id}`,
          method: "PATCH",
          body: NewFormData,
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    twoFa: builder.mutation({
      query: ({ actualData }) => {
        const  { access_token }  = getToken();
        return {
          url: "accounts/two-fa/",
          method: "POST",
          body: actualData,
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    changeUserPassword: builder.mutation({
      query: ({ actualData }) => {
        const  { access_token }  = getToken();
        return {
          url: "accounts/changepassword/",
          method: "POST",
          body: actualData,
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    sendPasswordResetEmail: builder.mutation({
      query: (user) => {
        return {
          url: "accounts/send-reset-password-email/",
          method: "POST",
          body: user,
          headers: {
            "Content-type": "application/json",
          },
        };
      },
    }),
    resetPassword: builder.mutation({
      query: ({ actualData, id, token }) => {
        return {
          url: `accounts/reset-password/${id}/${token}/`,
          method: "POST",
          body: actualData,
          headers: {
            "Content-type": "application/json",
          },
        };
      },
    }),
    registration: builder.mutation({
      query: (actualData) => {
        return {
          url: `accounts/registration/`,
          method: "POST",
          body: actualData,
          headers: {
            "Content-type": "application/json",
          },
        };
      },
    }),
    refreshAccessToken: builder.mutation({
      query: (refreshToken) => {
        return {
          url: "accounts/token/refresh/",
          method: "POST",
          body: refreshToken, // Fix: Pass the object directly
          headers: {
            "Content-type": "application/json",
          },
        };
      },
    }),
    storeRegistration: builder.mutation({
      query: ({ formData }) => {
        const { access_token } = getToken();
        return {
          url: "store/register_store/",
          method: "POST",
          body: formData,
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    getStaffUser: builder.query({
      query: ({storeCode}) => {
        const { access_token } = getToken();
        return {
          url: `accounts/users/?store=${storeCode}`,
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    productsRegistration: builder.mutation({
      query: ( actualData ) => {
        const { access_token } = getToken();
        return {
          url: "products/products/",
          method: "POST",
          body: actualData,
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    updateProducts: builder.mutation({
      query: ( {id, formData, storeCode} ) => {
        const { access_token } = getToken();
        return {
          url: `products/updateproducts/${storeCode}/${id}/`,
          method: "PATCH",
          body: formData,
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    getupdateproductsView: builder.query({
      query: ({storeCode,id}) => {
        const { access_token } = getToken();
        return {
          url: `products/updateproducts/${storeCode}/${id}/`,
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    productsView: builder.query({
      query: ({storeCode,id, page, search, pageSize, category, filter}) => {
        const { access_token } = getToken();
        return {
          url: `products/products/?store=${storeCode}${id ? `&id=${id}`: ""}${search ? `&search=${search}` : ""}${page ? `&page=${page}` : ""}${search ? `&search=${search}` : ""}${pageSize ? `&page_size=${pageSize}` : ""}${category && category != "All products" ? `&category=${category}` : ""}${filter ? `&filter=${filter}` : ""}`,
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    lowstockproductsView: builder.query({
      query: ({storeCode}) => {
        const { access_token } = getToken();
        return {
          url: `products/lowstockproducts/?store=${storeCode}`,
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    updatelowstockproducts: builder.mutation({
      query: ({actualData, id, varient}) => {
        const { access_token } = getToken();
        return {
          url: `products/lowstockproducts/?${varient ? `varient=${varient}&` : ""}id=${id}`,
          method: "PATCH",
          body: actualData,
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    expiredproductsView: builder.query({
      query: ({storeCode}) => {
        const { access_token } = getToken();
        return {
          url: `products/expiredproducts/?store=${storeCode}`,
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    deleteproducts: builder.mutation({
      query: ({id,varient}) => {
        const { access_token } = getToken();
        return {
          url: `products/products/?${varient ? `varient=${varient}` : `id=${id}`}`,
          method: "DELETE",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    categoryView: builder.query({
      query: ({storeCode, page, pageSize, search, filter}) => {
        const { access_token } = getToken();
        return {
          url: `products/category/${storeCode}/?page=${page}&page_size=${pageSize}&search=${search ? search : ""}${filter ? filter : ""}`,
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    addCategory: builder.mutation({
      query: ({formData, storeCode}) => {
        const { access_token } = getToken();
        return {
          url: `products/category/${storeCode}/`,
          method: "POST",
          body: formData,
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    upgradeCategory: builder.mutation({
      query: ({NewFormData,id, storeCode}) => {
        const { access_token } = getToken();
        return {
          url: `products/category/${storeCode}/update/?id=${id}`,
          method: "PATCH",
          body: NewFormData,
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    deleteCategory: builder.mutation({
      query: ({storeCode,id}) => {
        const { access_token } = getToken();
        return {
          url: `products/category/${storeCode}/delete/?id=${id}`,
          method: "DELETE",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    subCategoryView: builder.query({
      query: ({storeCode, page, pageSize, search, filter, category, categorysearch}) => {
        const { access_token } = getToken();
        let url = `products/subcategory/${storeCode}/?`;
        if (category || categorysearch) {
          url += `${category ? `category=${category}` : ""}${categorysearch ? `&categorysearch=${categorysearch}` : ""}`;
        } else {
          url += `page=${page}&page_size=${pageSize}&search=${search ? search : ""}${filter ? `&filter=${filter}` : ""}`;
        }
        return {
          url,
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    AddsubCategory: builder.mutation({
      query: ({formData, storeCode}) => {
        const { access_token } = getToken();
        return {
          url: `products/subcategory/${storeCode}/`,
          method: "POST",
          body: formData,
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    deletesubCategory: builder.mutation({
      query: ({id}) => {
        const { access_token } = getToken();
        return {
          url: `products/subcategorydata/${id}/`,
          method: "DELETE",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    upgradesubCategory: builder.mutation({
      query: ({NewFormData,id, storeCode}) => {
        const { access_token } = getToken();
        return {
          url: `products/subcategory/${storeCode}/update/?id=${id}`,
          method: "PATCH",
          body: NewFormData,
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    subsubCategoryView: builder.query({
      query: ({storeCode, page, pageSize, search, filter, subcategory, subcategorysearch}) => {
        const { access_token } = getToken();
        let url = `products/subsubcategory/${storeCode}/?`;
        if (subcategory || subcategorysearch) {
          url += `${subcategory ? `subcategory=${subcategory}` : ""}${subcategorysearch ? `&subcategorysearch=${subcategorysearch}` : ""}`;
        } else {
          url += `page=${page}&page_size=${pageSize}&search=${search ? search : ""}${filter ? `&filter=${filter}` : ""}`;
        }        
        return {
          url,
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    AddsubsubCategory: builder.mutation({
      query: ({formData, storeCode}) => {
        const { access_token } = getToken();
        return {
          url: `products/subsubcategory/${storeCode}/`,
          method: "POST",
          body: formData,
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    deletesubsubCategory: builder.mutation({
      query: ({storeCode,id}) => {
        const { access_token } = getToken();
        return {
          url: `products/subsubcategory/${storeCode}/${id}/`,
          method: "DELETE",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    upgradesubsubCategory: builder.mutation({
      query: ({NewFormData,id, storeCode}) => {
        const { access_token } = getToken();
        return {
          url: `products/subsubcategory/${storeCode}/${id}/`,
          method: "PATCH",
          body: NewFormData,
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    brandView: builder.query({
      query: ({storeCode,page,pageSize,search,filter}) => {
        const { access_token } = getToken();
        return {
          url: `products/brand/${storeCode}/?page=${page}&page_size=${pageSize}&search=${search ? search : ""}${filter ? `&filter=${filter}` : ""}`,
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    AddBrand: builder.mutation({
      query: ({formData, storeCode}) => {
        const { access_token } = getToken();
        return {
          url: `products/brand/${storeCode}/`,
          method: "POST",
          body: formData,
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    UpdateBrand: builder.mutation({
      query: ({NewFormData,id, storeCode}) => {
        const { access_token } = getToken();
        return {
          url: `products/brand/${storeCode}/${id}/`,
          method: "PATCH",
          body: NewFormData,
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    DeleteBrand: builder.mutation({
      query: ({id, storeCode}) => {
        const { access_token } = getToken();
        return {
          url: `products/brandd/${storeCode}/${id}/`,
          method: "DELETE",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    foreignkeyView: builder.query({
      query: ({storeCode}) => {
        const { access_token } = getToken();
        return {
          url: `products/foreignkey/?store=${storeCode}`,
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    unitView: builder.query({
      query: ({storeCode,page}) => {
        const { access_token } = getToken();
        return {
          url: `products/unit/${storeCode}/?page=${page}`,
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),    
    addUnit: builder.mutation({
      query: ({storeCode, actualData}) => {
        const { access_token } = getToken();
        return {
          url: `products/unit/${storeCode}/`,
          method: "POST",
          body: actualData,
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),    
    customerView: builder.query({
      query: ({storeCode, search, page}) => {
        const { access_token } = getToken();
        return {
          url: `store/customers/?store=${storeCode}${search ? `&search=${search}` : ""}${page ? `&search=${page}` : ""}`,
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    Addcustomer: builder.mutation({
      query: (actualData) => {
        const { access_token } = getToken();
        return {
          url: `store/customers/`,
          method: "POST",
          body: actualData,
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    Updatecustomer: builder.mutation({
      query: ({NewFormData,id}) => {
        const { access_token } = getToken();
        return {
          url: `store/customers/?id=${id}`,
          method: "PATCH",
          body: NewFormData,
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    Deletecustomer: builder.mutation({
      query: (id) => {
        const { access_token } = getToken();
        return {
          url: `store/customers/?id=${id}`,
          method: "DELETE",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    RedeemCodeView: builder.mutation({
      query: ({storeCode,code}) => {
        const { access_token } = getToken();
        return {
          url: `sales/redeemcode/?store=${storeCode}${code ? `&code=${code}` : '' }`,
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    AddRedeemCode: builder.mutation({
      query: (actualData) => {
        const { access_token } = getToken();
        return {
          url: `sales/redeemcode/`,
          method: "POST",
          body: actualData,
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    UpdateRedeemCode: builder.mutation({
      query: ({NewFormData,id}) => {
        const { access_token } = getToken();
        return {
          url: `sales/redeemcode/?id=${id}`,
          method: "PATCH",
          body: NewFormData,
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    DeleteRedeemCode: builder.mutation({
      query: (id) => {
        const { access_token } = getToken();
        return {
          url: `sales/redeemcode/?id=${id}`,
          method: "DELETE",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    AddInvoice: builder.mutation({
      query: (actualData) => {
        const { access_token } = getToken();
        return {
          url: `sales/sales/`,
          method: "POST",
          body: actualData,
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    GetInvoiceData: builder.query({
      query: ({storeCode}) => {
        const { access_token } = getToken();
        return {
          url: `sales/sales/?store=${storeCode}`,
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    dailyInvoiceData: builder.query({
      query: (storeCode) => {
        const { access_token } = getToken();
        return {
          url: `sales/sales/?store=${storeCode}&current=current_date`,
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    dailyHoldInvoiceData: builder.query({
      query: (storeCode) => {
        const { access_token } = getToken();
        return {
          url: `sales/sales/?store=${storeCode}&hold=current_date`,
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    creditsData: builder.query({
      query: ({storeCode,code, page, pageSize, search, filter}) => {
        const { access_token } = getToken();
        return {
          url: `sales/credits/${storeCode}/?page=${page}&page_size=${pageSize}${search ? `&search=${search}`: ""}${filter ? `&filter=${filter}` : ""}${code ? `?code=${code}` : ``}`,
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    ClearCredit: builder.mutation({
      query: ({actualData,id}) => {
        const { access_token } = getToken();
        return {
          url: `sales/sales/?id=${id}`,
          method: "PATCH",
          body: actualData,
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    DueChecker: builder.mutation({
      query: ({storeCode,actualData}) => {
        const { access_token } = getToken();
        return {
          url: `sales/due-checker/${storeCode}/`,
          method: "POST",
          body: actualData,
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
  }),
});

export const {
  useNotificationQuery,
  useRegisterUserMutation,
  useRegisterAdminMutation,
  useLoginUserMutation,
  useActiveUserMutation,
  useResendOtpMutation,
  useCheckActiveUserMutation,
  useGetLoggedUserQuery,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useTwoFaMutation,
  useChangeUserPasswordMutation,
  useSendPasswordResetEmailMutation,
  useResetPasswordMutation,
  useRegistrationMutation,
  useRefreshAccessTokenMutation,
  useStoreRegistrationMutation,
  useGetStaffUserQuery,
  useProductsRegistrationMutation,
  useUpdateProductsMutation,
  useGetupdateproductsViewQuery,
  useProductsViewQuery,
  useLowstockproductsViewQuery,
  useUpdatelowstockproductsMutation,
  useExpiredproductsViewQuery,
  useDeleteproductsMutation,
  useCategoryViewQuery,
  useAddCategoryMutation,
  useUpgradeCategoryMutation,
  useDeleteCategoryMutation,
  useSubCategoryViewQuery,
  useAddsubCategoryMutation, 
  useDeletesubCategoryMutation, 
  useUpgradesubCategoryMutation,
  useSubsubCategoryViewQuery,
  useAddsubsubCategoryMutation, 
  useDeletesubsubCategoryMutation, 
  useUpgradesubsubCategoryMutation,
  useBrandViewQuery,
  useAddBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useForeignkeyViewQuery,
  useUnitViewQuery,
  useAddUnitMutation,
  useCustomerViewQuery,
  useAddcustomerMutation,
  useUpdatecustomerMutation,
  useDeletecustomerMutation,
  useRedeemCodeViewMutation,
  useAddRedeemCodeMutation,
  useDeleteRedeemCodeMutation,
  useUpdateRedeemCodeMutation,
  useAddInvoiceMutation,
  useGetInvoiceDataQuery,
  useDailyInvoiceDataQuery,
  useDailyHoldInvoiceDataQuery,
  useCreditsDataQuery,
  useClearCreditMutation,
  useDueCheckerMutation,
} = userAuthapi;
