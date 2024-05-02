import { gql } from '@apollo/client'

export const INVITE_USER = gql`
	mutation InviteUser($email: String!, $role: Int!) {
		inviteUser(input: { email: $email, role: $role }) {
			token
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
export const INVITE_ADMIN_USER = gql`
	mutation InviteAdminUser($input: InviteAdminUserInput!) {
		inviteAdminUser(input: $input) {
			_id
			email
			firstName
			lastName
		}
	}
`
// ---------------
export const AUTH_USER = gql`
	mutation AuthUser($input: authUser!) {
		authUser(input: $input) {
			token
			firstName
			lastName
			userId
			role {
				name
			}
		}
	}
`

export const CREATE_CUSTOMER = gql`
	mutation CreateCustomer($input: CreateCustomerInput!) {
		createCustomer(input: $input) {
			token
			firstName
			lastName
			userId
		}
	}
`
export const UPDATE_CONCENT = gql`
	mutation UpdateConcent($_id: ID!, $input: UpdateConcentInput!) {
		updateConcent(_id: $_id, input: $input)
	}
`
