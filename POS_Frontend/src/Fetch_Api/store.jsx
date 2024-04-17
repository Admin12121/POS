import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { userAuthapi } from './Service/User_Auth_Api'
import authSlice from './Feature/authSlice'
export const store = configureStore({
  reducer: {
    [userAuthapi.reducerPath]: userAuthapi.reducer,
    auth: authSlice,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userAuthapi.middleware),
})

setupListeners(store.dispatch)