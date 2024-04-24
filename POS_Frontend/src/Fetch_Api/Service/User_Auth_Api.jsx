// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "./LocalStorageServices";
let { access_token } = getToken();

export const userAuthapi = createApi({
  reducerPath: "userAuthapi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/" }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (user) => {
        return {
          url: "accounts/user_register/",
          method: "POST",
          body: user,
          headers: {
            "Content-type": "application/json",
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
    getLoggedUser: builder.query({
      query: (access_token) => {
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
      query: ({ access_token, username }) => {
        return {
          url: `accounts/users/?name=${username}`,
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    changeUserPassword: builder.mutation({
      query: ({ actualData, access_token }) => {
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
      query: ({ actualData, access_token }) => {
        return {
          url: "store/register_store/",
          method: "POST",
          body: actualData,
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    productsRegistration: builder.mutation({
      query: ({ actualData }) => {
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
    productsView: builder.query({
      query: (actualData) => {
        return {
          url: `products/products/?store=${actualData}`,
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    categoryView: builder.query({
      query: (storeCode) => {
        return {
          url: `products/category/?store=${storeCode}`,
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    addCategory: builder.mutation({
      query: (actualData) => {
        return {
          url: `products/category/`,
          method: "POST",
          body: actualData,
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    deleteCategory: builder.mutation({
      query: (id) => {
        return {
          url: `products/category/?id=${id}`,
          method: "DELETE",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    subCategoryView: builder.query({
      query: (actualData) => {
        return {
          url: `products/subcategory/?store=${actualData}`,
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    AddsubCategory: builder.mutation({
      query: (actualData) => {
        return {
          url: `products/subcategory/`,
          method: "POST",
          body: actualData,
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    brandView: builder.query({
      query: (storeCode) => {
        return {
          url: `products/brand/?store=${storeCode}`,
          method: "GET",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    AddBrand: builder.mutation({
      query: (actualData) => {
        return {
          url: `products/brand/`,
          method: "POST",
          body: actualData,
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    UpdateBrand: builder.mutation({
      query: ({actualData,id}) => {
        return {
          url: `products/brand/?id=${id}`,
          method: "PATCH",
          body: actualData,
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
    DeleteBrand: builder.mutation({
      query: (id) => {
        return {
          url: `products/brand/?id=${id}`,
          method: "DELETE",
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        };
      },
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useRegisterAdminMutation,
  useLoginUserMutation,
  useGetLoggedUserQuery,
  useGetUserProfileQuery,
  useChangeUserPasswordMutation,
  useSendPasswordResetEmailMutation,
  useResetPasswordMutation,
  useRegistrationMutation,
  useRefreshAccessTokenMutation,
  useStoreRegistrationMutation,
  useProductsRegistrationMutation,
  useProductsViewQuery,
  useCategoryViewQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useSubCategoryViewQuery,
  useAddsubCategoryMutation,  
  useBrandViewQuery,
  useAddBrandMutation,
  useDeleteBrandMutation,
} = userAuthapi;
