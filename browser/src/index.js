import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";

const root = ReactDOM.createRoot(document.getElementById('root'));

const client = new ApolloClient({
    uri: 'http://localhost:4001/',
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    books: {
                        read(existing, {args: {skip = 0}}) {
                            //THIS ARGS IS ALWAYS THE INITIAL ARGS, NEVER IS UPDATED BY FETHMORE
                            console.log('read skip', skip)
                            return existing?.slice(skip, skip + 10);
                        },
                        keyArgs: false,
                        merge(existing, incoming, {args: {skip = 0}}) {
                            //THIS IS UPDATED OK
                            console.log('merge skip', skip)
                            const merged = existing ? existing.slice(0) : [];
                            for (let i = 0; i < incoming.length; ++i) {
                                merged[skip + i] = incoming[i];
                            }
                            return merged;
                        },
                    }
                }
            }
        }
    }),
});
root.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <App/>
        </ApolloProvider>
    </React.StrictMode>
);

