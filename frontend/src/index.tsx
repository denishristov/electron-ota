import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Provider } from 'mobx-react'

import Login from './Login';
import UserAPI from './stores/UserAPI'

import './index.css';
import UserStore from './stores/UserStore';

const stores = {
	userStore: new UserStore(new UserAPI())
}

ReactDOM.render(
	<Provider {...stores}>
		<Router>
			<div>
				<Route exact path="/" component={Login} />
			</div>
		</Router>
	</Provider>
, document.getElementById('root'));
