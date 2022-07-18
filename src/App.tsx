import React from 'react';
import './App.css';
import {Routes, Route} from "react-router-dom";
import Login from "./pages/Login";
import AwaitingAccess from "./pages/AwaitingAccess";
import LoginWith from "./pages/LoginWith";
import Home from "./pages/Home";
import Fallback from "./pages/Fallback";
import GroupNew from "./pages/GroupNew";
import AppContext, {createAppContext} from "./providers/AppContext";

function App() {
	const {
		context: app,
		views: {
			notif,
			modal
		}
	} = createAppContext();

	if(app.auth.loading) {
		return null;
	}

	return (
		<AppContext.Provider value={ app }>
			{ notif }
			{ modal }

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
		</AppContext.Provider>
	);
}

export default App;
