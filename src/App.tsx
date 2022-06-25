import React from 'react';
import './App.css';
import LoginPage from "./pages/login";
import {Routes, Route} from "react-router-dom";
import RegisterPage from "./pages/register";
import NotificationBanner from "./components/NotificationBanner";
import NotificationProvider from './providers/NotificationProvider';
import ErrorProvider from "./providers/ErrorProvider";

function App() {
	return (
		<NotificationProvider>
			<ErrorProvider>
				<>
					<NotificationBanner />

					<Routes>
						<Route path="/register" element={<RegisterPage />} />
						<Route path="/login" element={<LoginPage />} />
					</Routes>
				</>
			</ErrorProvider>
		</NotificationProvider>
	);
}

export default App;
