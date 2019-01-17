import React from 'react'
import { render } from 'react-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import { configure } from 'mobx'
import { Route, Router, Switch } from 'react-router-dom'

import 'reflect-metadata'
import './config/global'

import './index.sass'

import AppPage from './components/Apps/AppPage'
import AppsPage from './components/Apps/AppsPage'
import Login from './components/HomePage/Login'
import Register from './components/HomePage/Register'

import 'shared/dist/extensions'

import container from './dependencies/inversify.config'
import './util/extensions'

import { Provider } from 'mobx-react'
import { IRootStore } from './stores/RootStore'
import { Stores } from './dependencies/symbols'
import AuthenticatedRoute from './components/Generic/AuthenticatedRoute'
import DefaultPage from './components/HomePage/DefaultPage'
import { Transition, config } from 'react-spring'
import { getConfig } from './util/functions'

configure({
	computedRequiresReaction: true,
	enforceActions: 'always',
	isolateGlobalState: true,
})

const stores = container.get<IRootStore>(Stores.Root)
const browserHistory = createBrowserHistory()

const transitionProps = {
	PUSH: {
		from: { opacity: 0, transform: 'translateY(32px) scale(0.96)' },
		enter: { opacity: 1, transform: 'translateY(0px) scale(1)' },
		leave: { opacity: 0, transform: 'translateY(-32px) scale(0.92)' },
	},
	POP: {
		from: { opacity: 0, transform: 'translateY(-32px) scale(0.92)' },
		enter: { opacity: 1, transform: 'translateY(0px) scale(1)' },
		leave: { opacity: 0, transform: 'translateY(32px) scale(0.96)' },
	},
}

const app = (
	<Provider {...stores}>
		<Router history={browserHistory}>
			<Route render={({ location }) => (
				<Transition
					native
				 	items={location}
					keys={(location) => location.pathname}
					config={getConfig}
					{...browserHistory.action === 'POP'
						? transitionProps.POP
						: transitionProps.PUSH
					}
				>
					{(location) => (style) => (
						<Switch location={location}>
							<Route
								exact
								path='/setup'
								render={() => <Register style={style} />}
							/>
							<Route
								exact
								path='/login'
								render={(props) => <Login style={style} {...props} />}
							/>
							<AuthenticatedRoute
								exact
								path='/apps'
								render={(props) => <AppsPage style={style} {...props} />}
							/>
							<AuthenticatedRoute
								path='/apps/:id'
								render={(props) => <AppPage style={style} {...props} />}
							/>
							<Route component={DefaultPage} />
						</Switch>
					)}
				</Transition>
			)} />
		</Router>
	</Provider>
)

render(app, document.getElementById('root'))
