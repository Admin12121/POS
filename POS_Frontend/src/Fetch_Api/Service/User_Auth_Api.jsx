// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const userAuthapi = createApi({
  reducerPath: 'userAuthapi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/user/' }),
  endpoints:(builder) => ({
    registerUser : builder.mutation({
      query:(user)=>{
        return{
          url :'register/',
          method: 'POST',
          body: user,
          headers:{
            'Content-type' : 'application/json',
          }
        }
      }
    }),
    loginUser: builder.mutation({
      query: (user) => {
        return {
          url: 'login/',
          method: 'POST',
          body: user,
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    getLoggedUser: builder.query({
      query: (access_token) => {
        return {
          url: 'profile/',
          method: 'GET',
          headers: {
            'authorization': `Bearer ${access_token}`,
          }
        }
      }
    }),
    getUserProfile: builder.query({
      query: ({access_token, username}) => {
        return {
          url: `users/?name=${username}`,
          method: 'GET',
          headers: {
            'authorization': `Bearer ${access_token}`,
          }
        }
      }
    }),
    changeUserPassword: builder.mutation({
      query: ({ actualData, access_token }) => {
        return {
          url: 'changepassword/',
          method: 'POST',
          body: actualData,
          headers: {
            'authorization': `Bearer ${access_token}`,
          }
        }
      }
    }),
    sendPasswordResetEmail: builder.mutation({
      query: (user) => {
        return {
          url: 'send-reset-password-email/',
          method: 'POST',
          body: user,
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    resetPassword: builder.mutation({
      query: ({ actualData, id, token }) => {
        return {
          url: `/reset-password/${id}/${token}/`,
          method: 'POST',
          body: actualData,
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    registration: builder.mutation({
      query: (actualData) => {
        return {
          url: `/registration/`,
          method: 'POST',
          body: actualData,
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    refreshAccessToken: builder.mutation({
      query: (refreshToken) => {
        return {
          url: 'token/refresh/',
          method: 'POST',
          body: refreshToken,  // Fix: Pass the object directly
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    
  }),
})

export const { useUpdateUserInfoMutation, useRegisterUserMutation, useLoginUserMutation ,useGetLoggedUserQuery , useGetUserProfileQuery , useProjectdataQuery , useProjectQuery , useViewQuery , useProjectsMutation ,useUpdateprojectsMutation ,useDeleteprojectsMutation , useCourseMutation , useChangeUserPasswordMutation, useSendPasswordResetEmailMutation, useResetPasswordMutation, useRegistrationMutation ,useRefreshAccessTokenMutation, useFeedbackMutation } = userAuthapi;

