import React from 'react';
import { ROLE, routes } from '@/lib/permissions/config';
import { usePermissions } from '@/lib/permissions/usePermissions';
import { useRouter } from 'next/router';

const ProtectedRoute = ({ permission, children }) => {
	const { hasPermission } = usePermissions();
	const router = useRouter();

	if (!hasPermission(permission)) {
		router.push(routes.HOME);
	}

	return <>{children}</>;
};

export default ProtectedRoute;
