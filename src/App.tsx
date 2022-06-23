import React, {createContext, useCallback, useEffect, useState} from 'react';
import './App.css';
import LoginPage from "./pages/login";
import {Routes, Route} from "react-router-dom";
import RegisterPage from "./pages/register";
import AppErrorBanner from "./components/AppErrorBanner";

export interface AppNotice {
	id: string;
	message: string;
	level: 'warning' | 'info' | 'error' | 'fatal' | 'success' | 'reject' | 'resolve'
}
export interface INotificationContext {
	notices: AppNotice[],
	addNotice(notice: AppNotice): void;
	removeNotice(id: string): void;
}

export const NotificationContext = createContext<INotificationContext>({
	notices: [],
	addNotice: (notice: AppNotice) => {},
	removeNotice: (id: string) => {}
});

function App() {
	const [noticesDict, setNoticesDict] = useState<NodeJS.Dict<AppNotice>>({});
	const addNotice = useCallback((notice: AppNotice) => {
		setNoticesDict((prev) => ({ ...prev, [notice.id]: notice }))
	}, [noticesDict]);

	const removeNotice = useCallback((id: string) =>
			setNoticesDict((prev) => {
			delete prev[id];
			return { ...prev };
		})
	, [noticesDict]);

	const notificationContext = {
		notices: Object.values(noticesDict),
		addNotice,
		removeNotice
	} as INotificationContext;

	return (
		<>
			<NotificationContext.Provider value={notificationContext}>
				<AppErrorBanner />

				<Routes>
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/login" element={<LoginPage />} />
				</Routes>
			</NotificationContext.Provider>
		</>
	);
}

export default App;
