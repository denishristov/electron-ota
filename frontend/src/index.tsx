import createBrowserHistory from 'history/createBrowserHistory'
import { configure } from 'mobx'
import React from 'react'
import ReactDOM from 'react-dom'
import { Route, Router } from 'react-router-dom'
import 'reflect-metadata'

import AppsContainer from './components/Apps/AppsContainer'
import HomePage from './components/HomePage/HomePage'

import './index.sass'

import AppPage from './components/Apps/AppPage'
import Login from './components/HomePage/Login'
import Register from './components/HomePage/Register'

import 'shared'

import container from './dependencies/inversify.config'
import './util/extensions'

import { Provider } from 'mobx-react'
import { IRootStore } from './stores/RootStore'
import { Stores } from './dependencies/symbols'

configure({
	computedRequiresReaction: true,
	enforceActions: 'always',
	isolateGlobalState: true,
})

const stores = container.get<IRootStore>(Stores.Root)
const browserHistory = createBrowserHistory()
// TODO: checkout react-router conventions
const app = (
	<Provider {...stores}>
		<Router history={browserHistory}>
			<>
				<Route
					exact
					path='/'
					component={HomePage}
				/>
				<Route
					exact
					path='/register'
					component={Register}
				/>
				<Route
					exact
					path='/login'
					component={Login}
				/>
				<Route
					exact
					path='/apps'
					component={AppsContainer}
				/>
				<Route
					path='/apps/:id'
					component={AppPage}
				/>
				<Route component={HomePage} />
			</>
		</Router>
	</Provider>
)

ReactDOM.render(app, document.getElementById('root'))
