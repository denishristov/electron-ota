import React, { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Provider } from 'mobx-react'

import Login from './login/Login';
import UserAPI from './stores/UserAPI'
import UserStore from './stores/UserStore';

import './index.css';

const stores = {
	userStore: new UserStore(new UserAPI())
}

const app = (
	<Provider {...stores}>
		<Router>
			<div>
				<Route exact path="/" component={Login} />
			</div>
		</Router>
	</Provider>
)

ReactDOM.render(app, document.getElementById('root'));
