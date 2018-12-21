import { inject, observer } from 'mobx-react'
import React from 'react'
import { Redirect } from 'react-router'
import { RouteComponentProps } from 'react-router'
import { injectUserStore } from '../../stores/RootStore'
import { IUserStore } from '../../stores/UserStore'

interface IHomePageProps extends RouteComponentProps {
	userStore: IUserStore
}

const HomePage = ({ userStore, location }: IHomePageProps) => {
	console.log(userStore.isAuthenticated)
	return userStore.isAuthenticated
		? location.pathname === '/login'
			? <Redirect to='/apps' />
			: null
		: location.pathname !== '/login'
			? <Redirect to='/login' />
			: null
}

export default inject(injectUserStore)(observer(HomePage))
