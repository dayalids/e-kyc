import { gql } from '@apollo/client'

export const AUTH_USER = gql`
	mutation AuthUser($email: String!, $password: String!) {
		loginUser(input: { email: $email, password: $password }) {
			userId
			userRoles {
				title
				type
			}
			token
			firstName
			lastName
			status
		}
	}
`
export const INVITE_USER = gql`
	mutation InviteUser($email: String!, $role: Int!) {
		inviteUser(input: { email: $email, role: $role }) {
			token
		}
	}
`
export const LOGIN_USER = gql`
	mutation LoginUser($email: String!, $password: String!) {
		loginUser(input: { email: $email, password: $password }) {
			token
			firstName
			lastName
			userId
			spaces {
				_id
				spaceId
				customRoles {
					title
					type
					abilities {
						title
					}
				}
			}
			wallet {
				ethAddress
				eosAddress
				solAddress
				didAddress
			}
			userRoles {
				_id
				title
				type
				abilities {
					_id
					title
				}
			}
		}
	}
`
export const UPDATE_USER_DETAILS_MUTATION = gql`
	mutation UpdateUser($_id: String!, $input: UpdateUserInput!) {
		updateUser(_id: $_id, input: $input) {
			_id
			firstName
			lastName
			email
			mobile
			gender
		}
	}
`
export const PUT_OBJECT_PUBLIC_PRESIGNED_URL_MUTATION = gql`
	mutation PutObjectPublicPresignedUrl(
		$input: PutObjectPublicPresignedUrlInput!
	) {
		putObjectPublicPresignedUrl(input: $input) {
			key
			url
		}
	}
`

export const PUT_OBJECT_PRESIGNED_URL_MUTATION = gql`
	mutation PutObjectPresignedUrl($input: S3UploadInput!) {
		putObjectPresignedUrl(input: $input) {
			key
			url
		}
	}
`
