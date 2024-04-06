// https://github.com/vercel/next.js/discussions/23041#discussioncomment-480705
import React, {
	createContext,
	useContext,
	useMemo,
	useEffect,
	useCallback
} from 'react';

import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';

export function useAuth() {
	return useContext(AuthStateContext);
}

/**
 * if user role doesn't match the the protected route he is visiting 
 	redirect him to dashboard "/"
 *  
 */
function AuthProvider({ children }) {
	const selectUser = useCallback(state => state.auth.user, []);
	const user = useSelector(selectUser);
	const router = useRouter();
	const pathname = usePathname();
	let role = user?.role;
	let allowed = true;

	const authRoles = [
		'partner-admin',
		'recruiter',
		'maintainer',
		'super-admin',
		'portal-manager'
	];

	useEffect(() => {
		role = user?.userRole?.name;
		// console.log('role++++', user, pathname);
		if (!pathname.startsWith(`${role}`)) {
			allowed = false;
		}
		// authRoles.forEach(authRole => {

		// });
	}, [user, router]);

	// console.log('allowed++++', allowed);
	const ComponentToRender = allowed ? (
		children
	) : (
		<h1>404 Not Found</h1>
	);

	return <>{ComponentToRender}</>;
}

export default AuthProvider;
