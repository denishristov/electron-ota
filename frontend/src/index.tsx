import "reflect-metadata"
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route } from "react-router-dom"
import { configure } from 'mobx'
import createBrowserHistory from 'history/createBrowserHistory'
// import { RouterStore, syncHistoryWithStore } from 'mobx-react-router' remove this bitch

import HomePage from './components/HomePage/HomePage'
import AppsContainer from './components/Apps/AppsContainer'

import './index.css'

import Login from './components/HomePage/Login'
import AppPage from './components/Apps/AppPage'

import 'shared'

import container from './inversify.config';
import './util/extensions'

import { Provider } from 'mobx-react';
import { IRootStore } from './stores/RootStore';
import { TYPES } from './util/types';

configure({ 
	enforceActions: 'always', 
	computedRequiresReaction: true, 
	isolateGlobalState: true 
})

const rootStore = container.get<IRootStore>(TYPES.RootStore)
const browserHistory = createBrowserHistory()

const app = (
	<Provider {...rootStore}>
		<Router history={browserHistory}>
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
				<Route
					path="/apps/:id"
					component={AppPage}
				/>
			</React.Fragment>
		</Router>
	</Provider>
)

ReactDOM.render(app, document.getElementById('root'))
