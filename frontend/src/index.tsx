import React from 'react'
import { render } from 'react-dom'

import { configure } from 'mobx'
import { Route, Router } from 'react-router-dom'

import 'reflect-metadata'
import './config/global'
import 'shared/dist/extensions'

import container from './config/inversify.config'

import { AuthProvider } from './components/contexts/AuthProvider'
import { BrowserHistory } from './util/types'
import App from './components/App'

configure({
	computedRequiresReaction: true,
	enforceActions: 'always',
	isolateGlobalState: true,
})

const history = container.get<BrowserHistory>(DI.BrowserHistory)

render(
	<AuthProvider>
		<Router history={history}>
			<Route component={App} />
		</Router>
	</AuthProvider>
, document.getElementById('root'))
