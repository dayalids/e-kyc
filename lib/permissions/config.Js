export const ROLE = {
  PARTNER_ADMIN: 'partner-admin',
  RECRUITER: 'recruiter',
  MAINTAINER: 'maintainer',
  SUPER_ADMIN: 'super-admin',
  PORTAL_MANAGER: 'portal-manager',
  GUEST_USER: 'guest-user'
}

export const permissions = {
  'user.create': [
    ROLE.SUPER_ADMIN,
    ROLE.PARTNER_ADMIN,
    ROLE.MAINTAINER
  ],
  'user.read': Object.values(ROLE),
  'user.update': [
    ROLE.PARTNER_ADMIN,
    ROLE.RECRUITER,
    ROLE.MAINTAINER,
    ROLE.SUPER_ADMIN,
    ROLE.PORTAL_MANAGER
  ],
  'user.delete': [ROLE.SUPER_ADMIN, ROLE.PORTAL_MANAGER]
}

export const routes = {
  HOME: '/',
  USERS: '/user',
  WALLET: '/wallet'
}
