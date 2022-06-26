import React from 'react';
import './App.css';
import {Routes, Route} from "react-router-dom";
import LoginPage from "./pages/login";
import NotificationBanner from "./components/NotificationBanner";
import NotificationProvider from './providers/NotificationProvider';
import ErrorProvider from "./providers/ErrorProvider";

function App() {
	return (
		<NotificationProvider>
			<ErrorProvider>
				<main className="h-screen w-screen flex flex-col">
					<NotificationBanner />

					<section className="p-8 h-full overflow-auto">
						<Routes>
							<Route path="/login" element={<LoginPage />} />
						</Routes>
					</section>
				</main>
			</ErrorProvider>
		</NotificationProvider>
	);
}

export default App;
