import { gql } from '@apollo/client'

export const GET_ALL_USERS = gql`
	query GetAllUsers {
		getAllUsers {
			_id
			firstName
			lastName
			userID
			role
			lastLogin
		}
	}
`

export const GET_USER = gql`
	query GetUser($_id: ID!) {
		getUser(_id: $_id) {
			_id
		}
	}
`
export const LIST_ALL_USERS = gql`
	query ListAllUsers($pageNumber: Int, $pageSize: Int) {
		listAllUsers(pageNumber: $pageNumber, pageSize: $pageSize) {
			_id
			firstName
			lastName
			email
			mobile
			dob
			gender
			customerID
			userRole {
				name
			}
			kycConcent
			status
		}
	}
`
export const GET_CURRENT_USER = gql`
	query GetCurrentUser {
		getCurrentUser {
			_id
			firstName
			lastName
			email
			userRole {
				name
			}
		}
	}
`
export const GET_OBJECT_QUERY = gql`
	query GetObject($key: String!) {
		getObject(key: $key) {
			url
		}
	}
`

export const GET_ALL_ROLES = gql`
	query ListAllRoles {
		listAllRoles {
			_id
			title
			description
			type
			roleId
			abilities {
				_id
				title
			}
			createdBy
			updatedBy
			status
		}
	}
`

export const LIST_ALL_BANKS = gql`
	query ListAllBanks {
		listAllBanks {
			_id
			name
			description
			status
		}
	}
`
export const LIST_ALL_CONCENTS = gql`
	query ListAllConcents {
		listAllConcents {
			_id
			user {
				_id
				firstName
				org
			}
			requestedBy {
				_id
				firstName
				lastName
				org
			}
			status
		}
	}
`
