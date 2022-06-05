import React, {useState} from 'react';
import './App.css';
import {server} from "./services/api";

function App() {
	const [email, setEmail] = useState("");

	const clickedLogin = async () => {
		await server.login(email);
	};

	return (
		<div className="p-5 flex flex-row">
			<div className="mx-auto">
				<input type="text" name="email" placeholder="Enter email" value={email} onChange={ (e) => setEmail(e.target.value) } />
				<button className="primary mx-auto" onClick={clickedLogin}>Login</button>
			</div>
		</div>
	);
}

export default App;
