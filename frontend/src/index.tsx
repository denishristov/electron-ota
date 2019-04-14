
import * as tsNameOf from 'ts-nameof'
import * as a from 'ts-transform-async-to-mobx-flow'
import 'reflect-metadata'

import './config/global'
import 'shared/dist/extensions'

import React from 'react'
import { render } from 'react-dom'

import { Route, Router } from 'react-router-dom'
import container from './config/inversify.config'

import { AuthProvider } from './components/contexts/AuthProvider'
import { BrowserHistory } from './util/types'
import App from './components/App'
import { configure } from 'mobx'

import './index.sass'
import './styles/Menu.sass'
import 'react-contexify/dist/ReactContexify.min.css'

if (process.env.NODE_ENV !== 'production') {
	// tslint:disable-next-line:no-var-requires
	require('@welldone-software/why-did-you-render')(React, { onlyLogs: true })

	configure({
		computedRequiresReaction: true,
		enforceActions: 'observed',
	})
}

const history = container.get<BrowserHistory>(nameof<BrowserHistory>())

render(
	<AuthProvider>
		<Router history={history}>
			<Route component={App} />
		</Router>
	</AuthProvider>
, document.getElementById('root'))
