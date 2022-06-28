import React from 'react';
import './App.css';
import {Routes, Route} from "react-router-dom";
import LoginPage from "./pages/login";
import NotificationBanner from "./components/NotificationBanner";
import AwaitingAccess from "./pages/awaiting-access";
import AcceptAccess from "./pages/accept-access";
import Home from "./pages/home";

function App() {
	return (
		<main className="h-screen w-screen flex flex-col">
			<NotificationBanner />

			<section className="p-8 h-full overflow-auto">
				<Routes>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/login/:uuid/:token" element={<AcceptAccess />} />
					<Route path="/awaiting-access" element={<AwaitingAccess />} />
					<Route path="/home" element={<Home />} />
				</Routes>
			</section>
		</main>
	);
}

export default App;
