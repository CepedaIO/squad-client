import React, {useContext} from 'react';
import './App.css';
import {Routes, Route} from "react-router-dom";
import Login from "./pages/Login";
import NotificationBanner from "./components/NotificationBanner";
import AwaitingAccess from "./pages/AwaitingAccess";
import LoginWith from "./pages/LoginWith";
import Home from "./pages/Home";
import Fallback from "./pages/Fallback";
import {AuthContext} from "./providers/AuthProvider";

function App() {
	const { loading } = useContext(AuthContext);

	if(loading) {
		return <></>;
	}

	return (
		<main className="h-screen w-screen flex flex-col">
			<NotificationBanner />

			<section className="p-8 h-full overflow-auto">
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/login/:uuid/:token" element={<LoginWith />} />
					<Route path="/awaiting-access" element={<AwaitingAccess />} />
					<Route path="/home" element={<Home />} />
					<Route path="*" element={<Fallback />} />
				</Routes>
			</section>
		</main>
	);
}

export default App;
