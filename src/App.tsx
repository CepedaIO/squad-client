import React from 'react';
import './App.css';
import {Routes, Route} from "react-router-dom";
import LoginPage from "./pages/login";
import NotificationBanner from "./components/NotificationBanner";
import NotificationProvider from './providers/NotificationProvider';
import ErrorProvider from "./providers/ErrorProvider";

function App() {
	return (
		<main className="h-screen w-screen p-8">
			<NotificationProvider>
				<ErrorProvider>
					<>
						<NotificationBanner />

						<Routes>
							<Route path="/login" element={<LoginPage />} />
						</Routes>
					</>
				</ErrorProvider>
			</NotificationProvider>
		</main>
	);
}

export default App;
