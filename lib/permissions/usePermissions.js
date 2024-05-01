import { permissions } from '@/lib/permissions'

import { selectUserAuth } from '@/store/authReducer'
import { useSelector } from 'react-redux'

/**
 * @typedef {Object} Permissions
 * @property {(permission: keyof typeof permissions) => boolean} hasPermission
 */

/**
 * @returns {Permissions}
 */
export const usePermissions = () => {
  const userRole = useSelector(selectUserAuth).user?.defaultRole

  const hasPermission = permission => {
    return permissions[permission].includes(userRole)
  }

  return { hasPermission }
}
