import React from 'react'
import { observer } from 'mobx-react'

import { Switch, Route, RouteProps } from 'react-router'

import Register from './pages/Register'
import Login from './pages/Login'
import AuthenticatedRoute from './generic/AuthenticatedRoute'
import AppsPage from './pages/AppsPage'
import AppPage from './pages/AppPage'
import DefaultPage from './pages/DefaultPage'
import VersionPage from './pages/VersionPage/index'

export default observer(function Routes({ location }: RouteProps) {
	return (
		<Switch location={location}>
			<Route
				exact
				path='/setup'
				component={Register}
			/>
			<Route
				exact
				path='/login'
				component={Login}
			/>
			<AuthenticatedRoute
				exact
				path='/apps'
				component={AppsPage}
			/>
			<AuthenticatedRoute
				exact
				path='/apps/:appId'
				component={AppPage}
			/>
			<AuthenticatedRoute
				exact
				path='/apps/:appId/:versionId'
				component={VersionPage}
			/>
			<Route component={DefaultPage} />
		</Switch>
	)
})
