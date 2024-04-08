import { useEffect } from 'react';
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	createHttpLink
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Define your Apollo client
const httpLink = createHttpLink({
	uri:
		process.env.GRAPHQL_API ||
		'https://dev-apis.bharatblockchain.io/graphql'
});

const authLink = setContext((_, { headers }) => {
	// get the authentication token from local storage if it exists
	const token = localStorage.getItem('authToken');
	// return the headers to the context so httpLink can read them
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : ''
		}
	};
});

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache({
		addTypename: false //https://stackoverflow.com/questions/47211778/cleaning-unwanted-fields-from-graphql-responses/51380645#51380645
	})
});

export default function GraphQlProvider({ children }) {
	return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
