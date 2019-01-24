import React from 'react'
import { render } from 'react-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import { configure } from 'mobx'
import { Route, Router, RouteProps } from 'react-router-dom'

import 'reflect-metadata'
import './config/global'
import './util/extensions'
import 'shared/dist/extensions'

import container from './dependencies/inversify.config'

import { Provider } from 'mobx-react'
import { IRootStore } from './stores/RootStore'
import { Stores } from './dependencies/symbols'

import styles from './index.module.sass'
import { Transition } from 'react-spring'
import { getConfig } from './util/functions'
import { pageAnimations } from './util/constants/animations'
import { AnimationProvider } from './components/Context/AnimationContext'
import Routes from './components/Routes'
import { AuthProvider } from './components/Context/AuthProvider'

configure({
	computedRequiresReaction: true,
	enforceActions: 'always',
	isolateGlobalState: true,
})

const stores = container.get<IRootStore>(Stores.Root)
const browserHistory = createBrowserHistory()

function getPathName(location: RouteProps['location']) {
	return location ? location.pathname : 'key'
}

function appRenderer({ location }: RouteProps) {
	return (
		<>
			<div className={styles.background} />
			<Transition
				native
				keys={getPathName}
				items={location}
				config={getConfig}
				{...browserHistory.action === 'POP'
					? pageAnimations.POP
					: pageAnimations.PUSH
				}
			>
				{(location) => (animation) => (
					<AnimationProvider value={animation}>
						<Routes location={location} />
					</AnimationProvider>
				)}
			</Transition>
		</>
	)
}

const app = (
	<Provider {...stores}>
		<AuthProvider>
			<Router history={browserHistory}>
				<Route component={appRenderer} />
			</Router>
		</AuthProvider>
	</Provider>
)

render(app, document.getElementById('root'))
