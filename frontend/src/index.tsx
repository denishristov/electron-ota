import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route } from "react-router-dom"
import { Provider } from 'mobx-react'
import createBrowserHistory from 'history/createBrowserHistory'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import io from 'socket.io-client'

import UserStore from './stores/UserStore'
import Api from './util/Api'

import HomePage from './components/HomePage/HomePage'
import Applications from './components/Applications/Applications'

import './index.css'
import ApplicationsStore from './stores/ApplicationsStore';

require('./util/extensions')

const api = new Api(io('http://localhost:4000'))

const stores = {
	routeStore: new RouterStore(),
	userStore: new UserStore(api),
	applicationsStore: new ApplicationsStore(api)
}

const browserHistory = createBrowserHistory()
const history = syncHistoryWithStore(browserHistory, stores.routeStore)

const app = (
	<Provider {...stores}>
		<Router history={history}>
			<div>
				<Route
					exact 
					path="/"
					component={HomePage}
				/>
				<Route
					exact
					path="/applications"
					component={Applications}
				/>
			</div>
		</Router>
	</Provider>
)

ReactDOM.render(app, document.getElementById('root'))
