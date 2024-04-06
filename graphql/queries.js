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
export const GET_USERS = gql`
	query Users($pageNumber: Int!) {
		users(pageNumber: $pageNumber) {
			_id
			firstName
			lastName
			email
			userRoles {
				_id
				title
				type
			}
			status
			createdAt
			updatedAt
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
			mobile
			userRoles {
				_id
				title
				type
			}
			status
			createdAt
			updatedAt
			wallet {
				ethAddress
				eosAddress
				solAddress
				didAddress
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
