import React from 'react'
import { Switch, Route, RouteProps } from 'react-router'
import Register from './HomePage/Register'
import Login from './HomePage/Login'
import AuthenticatedRoute from './Generic/AuthenticatedRoute'
import AppsPage from './Apps/AppsPage'
import AppPage from './Apps/AppPage'
import DefaultPage from './HomePage/DefaultPage'

export default function Routes({ location }: RouteProps) {
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
}
