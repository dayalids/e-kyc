import { createContext, useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { ROLES } from '@/constant/roles';
import { selectUserAuth } from '@/store/authReducer';

const RoleContext = createContext();

export function useRole() {
	return useContext(RoleContext);
}

export function RoleProvider({ children }) {
	const router = useRouter();
	const pathname = usePathname();
	const {
		user: { defaultRole: userRole }
	} = useSelector(selectUserAuth);

	const getAllowedRoles = userRole => {
		switch (userRole) {
			case ROLES.SUPER_ADMIN:
				return [ROLES.SUPER_ADMIN];
			default:
				return [userRole];
		}
	};

	useEffect(() => {
		const authToken = localStorage.getItem('authToken');
		const allowedRoles = getAllowedRoles(userRole);
		const cachedRole = localStorage.getItem('userRole');

		if (!authToken || (!cachedRole && !userRole))
			return router.push('/auth/login');

		console.log('cachedRole', cachedRole);
		console.log('pathname', pathname);
		console.log('allowedRoles', allowedRoles);
		if (pathname === '/' && !allowedRoles.includes(cachedRole)) {
			console.log('pushing to default role');
			router.push(`/${cachedRole}`);
		}
	}, [pathname]);

	return (
		<RoleContext.Provider value={userRole}>
			{children}
		</RoleContext.Provider>
	);
}
