import React from 'react';
import ReactDOM from 'react-dom/client';
import './main.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import {ApolloClient, ApolloProvider, createHttpLink, InMemoryCache} from "@apollo/client";
import NotificationProvider from "./providers/NotificationProvider";
import ErrorProvider from "./providers/ErrorProvider";
import {setContext} from "@apollo/client/link/context";
import NavigationProvider from "./providers/NavigationProvider";
import AuthProvider from "./providers/AuthProvider";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const client = new ApolloClient({
  link: setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: localStorage.getItem('auth') || ''
    }
  })).concat(createHttpLink({
    uri: 'http://localhost:8080',
  })),
  cache: new InMemoryCache(),
});

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <NotificationProvider>
        <ErrorProvider>
          <BrowserRouter>
            <AuthProvider>
              <NavigationProvider>
                <App />
              </NavigationProvider>
            </AuthProvider>
          </BrowserRouter>
        </ErrorProvider>
      </NotificationProvider>
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
