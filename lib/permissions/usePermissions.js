import {permissions} from "@/lib/permissions";

import { selectUserAuth } from '@/store/authReducer';

export const usePermissions = () => {
	const userRole = (selectUserAuth).user?.defaultRole;

	const hasPermission = (permission) => {
		return permissions[permission].includes(userRole);
	};

	return { hasPermission };
};