import React from 'react';
import './App.css';
import {useRoutes} from "react-router-dom";
import Login from "./pages/auth/Login";
import AwaitingAccess from "./pages/auth/AwaitingAccess";
import LoginWith from "./pages/auth/LoginWith";
import Home from "./pages/Home";
import Fallback from "./pages/Fallback";
import EventNew from "./pages/event/EventNew";
import AppContext, {createAppContext} from "./providers/AppContext";
import EventView from "./pages/event/EventView";
import EventInvite from "./pages/event/EventInvite";
import Join from "./pages/Join";

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
			path: '/login-with/:uuid/:key',
			element: <LoginWith/>
		}, {
			path: '/awaiting-access',
			element: <AwaitingAccess />
		}, {
			path: '/home',
			element: <Home />
		}, {
			path: '/join/:key',
			element: <Join />
		},{
			path: '/event/new',
			element: <EventNew />
		}, {
			path: '/event/:id',
			element: <EventView />
		}, {
			path: '/event/:id/invite/:uuid/:key',
			element: <EventInvite />
		}, {
			path: '*',
			element: <Fallback />
		}
	]);

	if(app.auth.loading) {
		return null;
	}

	return (
		<AppContext.Provider value={ app }>
			{ notif }
			{ modal }

			<main className="h-screen w-screen flex flex-col items-center m-8 overflow-y-auto">
				{ routes }
			</main>
		</AppContext.Provider>
	);
}

export default App;
