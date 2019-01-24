import React from 'react'
import { Switch, Route, RouteProps } from 'react-router'
import Register from './Setup/Register'
import Login from './Setup/Login'
import AuthenticatedRoute from './Generic/AuthenticatedRoute'
import AppsPage from './AppsPage'
import AppPage from './AppPage'
import DefaultPage from './Setup/DefaultPage'
import { observer } from 'mobx-react'

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
				path='/apps/:id'
				component={AppPage}
			/>
			<Route component={DefaultPage} />
		</Switch>
	)
})
