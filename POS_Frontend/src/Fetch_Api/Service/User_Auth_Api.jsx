// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const userAuthapi = createApi({
  reducerPath: 'userAuthapi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://project.vickytajpuriya.com/user/' }),
  //baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/user/' }),
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
    updateUserInfo: builder.mutation({
      query: ({ actualData, access_token }) => {
        const formData = new FormData();

        // Add non-file data to FormData
        Object.keys(actualData).forEach(key => {
          if (key !== 'file') {
            formData.append(key, actualData[key]);
          }
        });
    
        // Add file data to FormData
        if (actualData.file) {
          formData.append('file', actualData.file);
        }
        console.log(formData)
        console.log(actualData)
        // return {
        //   url: 'userinfo/',
        //   method: 'POST',
        //   body: formData,
        //   headers: {
        //     'authorization': `Bearer ${access_token}`,
        //     'Content-Type': 'application/json',
        //   }
        // }
      }
    }),
    course: builder.mutation({
      query: ({ actualData, access_token }) => {
        return {
          url: 'activecourse/',
          method: 'POST',
          body: actualData,
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
    projectdata: builder.query({
      query: ({username,access_token,project_title}) => {
        return {
          url: `projects/?name=${username}&project_title=${project_title}`,
          method:'GET',
          headers: {
            'authorization': `Bearer ${access_token}`,
          }
        }
      }
    }),
    project: builder.query({
      query: ({access_token, page}) => {
        return {
          url: `${page ? `projects/?page=${page}`: "projects/" } `,
          method:'GET',
          headers: {
            'authorization': `Bearer ${access_token}`,
          }
        }
      }
    }),
    view: builder.query({
      query: ({access_token,username}) => {
        return {
          url: `projects/?name=${username}`,
          method:'GET',
          headers: {
            'authorization': `Bearer ${access_token}`,
          }
        }
      }
    }),
    projects: builder.mutation({
      query: ( {actualData, access_token} ) => {
        return {
          url: 'projects/',
          method:'POST',
          body: actualData,
          headers: {
            'authorization': `Bearer ${access_token}`,
          }
        }
      }
    }),
    updateprojects: builder.mutation({
      query: ({username,access_token,project_title,actualData,id }) => {
        console.log(actualData)
        return {
          url: `projects/?name=${username}&project_title=${project_title}&id=${id}`,
          method:'PATCH',
          body: actualData,
          headers: {
            'authorization': `Bearer ${access_token}`,
          }
        }
      }
    }),
    deleteprojects: builder.mutation({
      query: ({ id, access_token, username }) => ({  //http://127.0.0.1:8000/user/projects/?name=Admin&id=3
        url: `projects/?name=${username}&id=${id}`, // Assuming projectId is the ID of the project you want to delete
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${access_token}`,  // Sending the username for permission check on the server side
        },
      }),
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
    feedback: builder.mutation({
      query:({actualData, access_token}) =>{
        return{
          url: 'feedback',
          method : 'POST',
          body : actualData,
          headers: {
            'authorization': `Bearer ${access_token}`,
          }
        }
      }
    })    
  }),
})

export const { useUpdateUserInfoMutation, useRegisterUserMutation, useLoginUserMutation ,useGetLoggedUserQuery , useGetUserProfileQuery , useProjectdataQuery , useProjectQuery , useViewQuery , useProjectsMutation ,useUpdateprojectsMutation ,useDeleteprojectsMutation , useCourseMutation , useChangeUserPasswordMutation, useSendPasswordResetEmailMutation, useResetPasswordMutation, useRegistrationMutation ,useRefreshAccessTokenMutation, useFeedbackMutation } = userAuthapi;


export const courseApi = createApi({
  reducerPath: 'userAuthapi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://project.vickytajpuriya.com/tutorials/' }),
  endpoints:(builder) => ({
    course: builder.query({
      query: ({access_token,name,video_title}) => {
        if (name)
         { return {
            url: `course/?name=${name}`,
            method: 'GET',
            headers: {
              'authorization': `Bearer ${access_token}`,
            }
          }
        }
        else if(video_title){
            return {
              url: `coursedata/?video_title=${video_title}`,
              method: 'GET',
              headers: {
                'authorization': `Bearer ${access_token}`,
              }
            }
          }      
        else{
            return {
              url: `course/`,
              method: 'GET',
              headers: {
                'authorization': `Bearer ${access_token}`,
              }
            }
          }      
        }
      
    }),
  }),
})

export const { useCourseQuery } = courseApi;

