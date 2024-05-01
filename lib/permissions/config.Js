export const ROLE = {
  SUPER_ADMIN: 'super-admin',
  EMPLOYEE: 'employee',
  USER: 'user'
}

export const permissions = {
  'bank.userlist': [ROLE.SUPER_ADMIN, ROLE.EMPLOYEE],
  'bank.employeeList': [ROLE.SUPER_ADMIN, ROLE.EMPLOYEE],
  'user.requests': [ROLE.USER],
  'users.all': [ROLE.SUPER_ADMIN, ROLE.EMPLOYEE, ROLE.USER]
}

export const routes = {
  HOME: '/',
  USERS: '/user'
}
