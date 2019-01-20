import React from 'react'
import { render } from 'react-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import { configure } from 'mobx'
import { Route, Router } from 'react-router-dom'

import 'shared/dist/extensions'
import 'reflect-metadata'
import './config/global'

import './index.sass'

import container from './dependencies/inversify.config'
import './util/extensions'

import { Provider } from 'mobx-react'
import { IRootStore } from './stores/RootStore'
import { Stores } from './dependencies/symbols'
import { Transition } from 'react-spring'
import { getConfig } from './util/functions'
import { AnimationProvider } from './components/Context/AnimationContext'
import Routes from './components/Routes'
import PageTransitions from './constants/PageTransitions'

configure({
	computedRequiresReaction: true,
	enforceActions: 'always',
	isolateGlobalState: true,
})

const stores = container.get<IRootStore>(Stores.Root)
const browserHistory = createBrowserHistory()

const app = (
	<Provider {...stores}>
		<Router history={browserHistory}>
			<Route render={({ location }) => (
				<>
					<div className='background' />
					<Transition
						native
					 	items={location}
						keys={(location) => location.pathname}
						config={getConfig}
						{...browserHistory.action === 'POP'
							? PageTransitions.POP
							: PageTransitions.PUSH
						}
					>
						{(location) => (animation) => (
							<AnimationProvider value={animation}>
								<Routes location={location} />
							</AnimationProvider>
						)}
					</Transition>
				</>
			)} />
		</Router>
	</Provider>
)

render(app, document.getElementById('root'))
