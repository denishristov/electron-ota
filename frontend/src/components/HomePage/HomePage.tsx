import React from 'react'
import { Redirect } from 'react-router'
import Login from './Login'
import { inject, observer } from 'mobx-react'
import { IUserStore } from '../../stores/UserStore'
import { RouteComponentProps } from 'react-router'

interface IHomePageProps extends RouteComponentProps {
	userStore: IUserStore
}

const HomePage = ({ userStore, location }: IHomePageProps) => {
	return userStore.isAuthenticated
		? location.pathname === '/apps'
			? null
			: <Redirect to="/apps" />
		: userStore.isLoading
			? <div>Loading...</div>
			: <Redirect to="/login" />
}

export default inject(stores => ({ userStore: stores.userStore }))(observer(HomePage))