import { createSlice } from '@reduxjs/toolkit'

interface AuthState {
  access_token: string | null;
  refresh_token: string | null;
}

const initialState: AuthState = {
  access_token: null,
  refresh_token: null,
}

export const authSlice = createSlice({
  name: 'auth_token',
  initialState,
  reducers: {
    setUserToken: (state, action) => {
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
    },
    unSetUserToken: (state, action) => {
      state.access_token = action.payload.access_token
      state.refresh_token = action.payload.refresh_token
    },
  },
})

export const { setUserToken, unSetUserToken } = authSlice.actions

export default authSlice.reducer