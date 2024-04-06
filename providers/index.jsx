import React from 'react';
import GraphQlProvider from './graphql-provider';
import ReduxProvider from './redux-provider';
import AuthProvider from './auth-provider';
import ReactQueryProvider from './react-query-provider';
import ToastProvider from './toast-provider';
import { RoleProvider } from './role-provider';

const Providers = ({ children }) => {
	return (
		<GraphQlProvider>
			<ReduxProvider>
				<AuthProvider>
					<ToastProvider>
						<RoleProvider>{children}</RoleProvider>
					</ToastProvider>
				</AuthProvider>
			</ReduxProvider>
		</GraphQlProvider>
	);
};

export default Providers;
