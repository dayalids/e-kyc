export const ROLE = {
	// SUPER_ADMIN: 'super-admin',
  SUPER_ADMIN: 'SUPER-ADMIN',
  EMPLOYEE: 'EMPLOYEE',
  USER: 'CUSTOMER'
}

export const permissions = {
  'bank.list': [ROLE.SUPER_ADMIN],
  'user.list': [ROLE.SUPER_ADMIN],
  'bank.userlist': [
    ROLE.SUPER_ADMIN,
    ROLE.EMPLOYEE,
    ROLE.SUPER_ADMIN
  ],
  'bank.employeeList': [ROLE.SUPER_ADMIN],
  'user.requests': [ROLE.EMPLOYEE, ROLE.USER],
  'customer.list': [ROLE.EMPLOYEE],
  'users.all': [
    ROLE.SUPER_ADMIN,
    ROLE.EMPLOYEE,
    ROLE.USER,
    ROLE.SUPER_ADMIN
  ]
}

export const routes = {
  HOME: '/',
  USERS: '/user'
}
