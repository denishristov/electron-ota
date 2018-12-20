import createBrowserHistory from 'history/createBrowserHistory'
import { configure } from 'mobx'
import React from 'react'
import ReactDOM from 'react-dom'
import { Route, Router } from 'react-router-dom'
import 'reflect-metadata'
// import { RouterStore, syncHistoryWithStore } from 'mobx-react-router' remove this bitch

import AppsContainer from './components/Apps/AppsContainer'
import HomePage from './components/HomePage/HomePage'

import './index.scss'

import AppPage from './components/Apps/AppPage'
import Login from './components/HomePage/Login'

import 'shared'

import container from './inversify.config'
import './util/extensions'

import { Provider } from 'mobx-react'
import AppsStore from './stores/AppsStore'
import { IRootStore } from './stores/RootStore'
import UserStore from './stores/UserStore'
import Api from './util/Api'
import { TYPES } from './util/types'

configure({
	computedRequiresReaction: true,
	enforceActions: 'always',
	isolateGlobalState: true,
})

const api = new Api()

const rootStore = {
	appsStore: new AppsStore(api),
	userStore: new UserStore(api),
}
const browserHistory = createBrowserHistory()

const app = (
	<Provider {...rootStore}>
		<Router history={browserHistory}>
			<React.Fragment>
				<Route
					path='/'
					component={HomePage}
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
			</React.Fragment>
		</Router>
	</Provider>
)

ReactDOM.render(app, document.getElementById('root'))
