import React from 'react';
import GraphQlProvider from './graphql-provider';
import ReduxProvider from './redux-provider';

import ToastProvider from './toast-provider';
import { RoleProvider } from './role-provider';

const Providers = ({ children }) => {
	return (
		<GraphQlProvider>
			<ReduxProvider>
				<ToastProvider>
					<RoleProvider>{children}</RoleProvider>
				</ToastProvider>
			</ReduxProvider>
		</GraphQlProvider>
	);
};

export default Providers;
