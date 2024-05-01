'use client';
import React from 'react';
import { routes, usePermissions } from '@/lib/permissions';

import { useRouter } from 'next/navigation';

const ProtectedRoute = ({ permission, children }) => {
	const { hasPermission } = usePermissions();
	const router = useRouter();

	if (!hasPermission(permission)) {
		router.push(routes.HOME);
	}

	return <>{children}</>;
};

export default ProtectedRoute;
