export const ROLE = {
  SUPER_ADMIN: 'super-admin',
  EMPLOYEE: 'employee',
  USER: 'user'
}

export const permissions = {
  'user.create': [ROLE.SUPER_ADMIN, ROLE.EMPLOYEE],
  'user.read': Object.values(ROLE),
  'user.update': [ROLE.SUPER_ADMIN, ROLE.EMPLOYEE, ROLE.USER],
  'user.delete': [ROLE.SUPER_ADMIN]
}

export const routes = {
  HOME: '/',
  USERS: '/user',
  WALLET: '/wallet'
}
