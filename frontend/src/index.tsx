import React from 'react'
import { render } from 'react-dom'

import { configure } from 'mobx'
import { Route, Router } from 'react-router-dom'

import 'reflect-metadata'
import './config/global'
import './util/extensions'
import 'shared/dist/extensions'

import container from './dependencies/inversify.config'

import { Provider } from 'mobx-react'
import { IRootStore } from './stores/RootStore'

import { AuthProvider } from './components/contexts/AuthProvider'
import { BrowserHistory } from './util/types'
import App from './components/App'

configure({
	computedRequiresReaction: true,
	enforceActions: 'always',
	isolateGlobalState: true,
})

const stores = container.get<IRootStore>(DI.Stores.Root)
const history = container.get<BrowserHistory>(DI.BrowserHistory)

render(
	<Provider {...stores}>
		<AuthProvider>
			<Router history={history}>
				<Route component={App} />
			</Router>
		</AuthProvider>
	</Provider>
, document.getElementById('root'))
