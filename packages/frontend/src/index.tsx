import * as tsNameOf from 'ts-nameof'
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

import './index.sass'
import './styles/Menu.sass'
import 'react-contexify/dist/ReactContexify.min.css'

const history = container.get<BrowserHistory>(nameof<BrowserHistory>())

render(
	<AuthProvider>
		<Router history={history}>
			<Route component={App} />
		</Router>
	</AuthProvider>
, document.getElementById('root'))
