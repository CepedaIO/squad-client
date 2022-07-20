import React from 'react';
import './App.css';
import {useRoutes} from "react-router-dom";
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

	const routes = useRoutes([
		{
			path: '/login',
			element: <Login />
		}, {
			path: '/login-with/:uuid/:token',
			element: <LoginWith/>
		}, {
			path: '/awaiting-access',
			element: <AwaitingAccess />
		}, {
			path: '/home',
			element: <Home />
		}, {
			path: '/group/new',
			element: <GroupNew />
		}, {
			path: '*',
			element: <Fallback />
		}
	])

	if(app.auth.loading) {
		return null;
	}

	return (
		<AppContext.Provider value={ app }>
			{ notif }
			{ modal }

			<main className="h-screen w-screen flex flex-col">
				<section className="p-8 h-full overflow-auto">
					{ routes }
				</section>
			</main>
		</AppContext.Provider>
	);
}

export default App;
