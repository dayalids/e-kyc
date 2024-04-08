import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  roles: [],
  dappOptions: [],
  abilitiesOptions: []
}

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setRoles (state, action) {
      state.roles = action.payload
    },
    addRole (state, action) {
      state.roles.push(action.payload)
    },
    updateRole (state, action) {
      state.roles = state.roles.map(
				role =>
					role._id === action.payload._id ? action.payload : role
			)
    },
    deleteRole (state, action) {
      state.roles = state.roles.filter(
				role => role._id !== action.payload
			)
    },
    setDappOptions (state, action) {
      state.dappOptions = action.payload
    },
    setAbilitiesOptions (state, action) {
      state.abilitiesOptions = action.payload
    }
  }
})

export const {
	setRoles,
	addRole,
	updateRole,
	deleteRole,
	setAbilitiesOptions,
	setDappOptions
} = roleSlice.actions

export default roleSlice.reducer
