import React, {useContext} from 'react';
import './App.css';
import {Routes, Route} from "react-router-dom";
import Login from "./pages/Login";
import AwaitingAccess from "./pages/AwaitingAccess";
import LoginWith from "./pages/LoginWith";
import Home from "./pages/Home";
import Fallback from "./pages/Fallback";
import {AuthContext} from "./providers/AuthProvider";
import GroupNew from "./pages/GroupNew";
import NavigationProvider from "./providers/NavigationProvider";

function App() {
	const { loading } = useContext(AuthContext);

	if(loading) {
		return <></>;
	}

	return (
		<NavigationProvider>
			<main className="h-screen w-screen flex flex-col">
				<section className="p-8 h-full overflow-auto">
					<Routes>
						<Route path="/login" element={<Login />} />
						<Route path="/login-with/:uuid/:token" element={<LoginWith />} />
						<Route path="/awaiting-access" element={<AwaitingAccess />} />
						<Route path="/home" element={<Home />} />
						<Route path={"/group/new"} element={<GroupNew />} />
						<Route path="*" element={<Fallback />} />
					</Routes>
				</section>
			</main>
		</NavigationProvider>
	);
}

export default App;
