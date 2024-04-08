import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  users: []
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers (state, action) {
      state.users = action.payload
    },

    addUser (state, action) {
      state.users.push(action.payload)
    },

    updateUser (state, action) {
      state.users = state.users.map(
				user =>
					user._id === action.payload._id ? action.payload : user
			)
    },
    deleteUser (state, action) {
      state.users = state.users.filter(
				user => user._id !== action.payload
			)
    }
  }
})

export const {
	setUsers,
	addUser,
	updateUser,
	deleteUser
} = usersSlice.actions
export const selectUser = state => state.users
export default usersSlice.reducer
