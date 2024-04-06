import { ROLE, permissions } from '@/lib/permissions/config';

import { selectUserAuth } from '@/store/authSlice';

export const usePermissions = () => {
	const userRole = (selectUserAuth).user?.defaultRole;

	const hasPermission = (permission) => {
		return permissions[permission].includes(userRole);
	};

	return { hasPermission };
};