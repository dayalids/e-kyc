import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'

// save users in local storage

const initialState = {
  user: {
    _id: '',
    firstName: '',
    lastName: '',
    gender: '',
    userRoles: [],
    defaultRole: '',
    mobile: '',
    profilePic: '',
    email: '',
    wallet: []
  },
  authToken: ''
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    loadUser: (state, action) => {
      state.user = {
        ...state.user,
        _id: action.payload._id,
        userRoles: action.payload.userRoles,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        gender: action.payload.gender,
        mobile: action.payload.mobile,
        profilePic: action.payload.profilePic,
        email: action.payload.email,
        defaultRole: action.payload.defaultRole,
        wallet: action.payload.wallet
      }
    },
    handleLogin: (state, action) => {
			// console.log({ payload: action.payload })
      state.authToken = action.payload.token
      state.user = {
        ...state.user,
        _id: action.payload._id,
        userRoles: action.payload.userRoles,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        defaultRole: action.payload.defaultRole
      }
    },
    handleLogout: (state, action) => {
      state.authToken = initialState.authToken
      state.user = initialState.user
    },
    setWallet: (state, action) => {
      state.user.wallet = action.payload
    }
  }
})

export const {
	handleRegister,
	handleLogin,
	handleLogout,
	loadUser,
	setWallet
} = authSlice.actions
export const selectUserAuth = state => state.auth
export default authSlice.reducer
