import { createContext, useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';

import { selectUserAuth } from '@/store/authReducer';

import { usePermissions, ROLE } from '@/lib/permissions';

const RoleContext = createContext();

export function useRole() {
	return useContext(RoleContext);
}

export function RoleProvider({ children }) {
	const router = useRouter();
	const pathname = usePathname();
	const {
		user: { defaultRole: userRole } //defaultRole alias -> userRole
	} = useSelector(selectUserAuth);
	const { hasPermission } = usePermissions();

	useEffect(() => {
		const authToken = localStorage.getItem('authToken');

		const cachedRole = localStorage.getItem('userRole');

		if (!authToken || (!cachedRole && !userRole))
			return router.push('/auth/login');

		console.log('cachedRole', cachedRole);
		console.log('pathname', pathname);
	}, [pathname]);

	return (
		<RoleContext.Provider value={userRole}>
			{children}
		</RoleContext.Provider>
	);
}
