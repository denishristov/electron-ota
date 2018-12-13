import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route } from "react-router-dom"
import { Provider } from 'mobx-react'
import { configure } from 'mobx'
import createBrowserHistory from 'history/createBrowserHistory'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import io from 'socket.io-client'

import UserStore from './stores/UserStore'
import Api from './util/Api'

import HomePage from './components/HomePage/HomePage'
import AppsContainer from './components/Apps/AppsContainer'

import './index.css'
import AppsStore from './stores/AppsStore'
import Login from './components/HomePage/Login';

require('./util/extensions')

configure({ 
	enforceActions: 'always', 
	computedRequiresReaction: true, 
	isolateGlobalState: true 
})

const api = new Api(io('http://localhost:4000/admins'))

const stores = {
	routeStore: new RouterStore(),
	userStore: new UserStore(api),
	appsStore: new AppsStore(api)
}

const browserHistory = createBrowserHistory()
const history = syncHistoryWithStore(browserHistory, stores.routeStore)

const app = (
	<Provider {...stores}>
		<Router history={history}>
			<React.Fragment>
				<Route
					path="/"
					component={HomePage}
				/>
				<Route
					exact
					path="/login"
					component={Login}
				/>
				<Route
					exact
					path="/apps"
					component={AppsContainer}
				/>
			</React.Fragment>
		</Router>
	</Provider>
)

ReactDOM.render(app, document.getElementById('root'))
