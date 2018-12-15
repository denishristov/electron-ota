import React from 'react'
import { Redirect } from 'react-router'
import { inject, observer } from 'mobx-react'
import { IUserStore } from '../../stores/UserStore'
import { RouteComponentProps } from 'react-router'
import { injectUserStore } from '../../stores/RootStore';

interface IHomePageProps extends RouteComponentProps {
	userStore: IUserStore
}

const HomePage = ({ userStore, location }: IHomePageProps) => {
	return userStore.isAuthenticated
		? location.pathname === '/login'
			? <Redirect to="/apps" />
			: null
		: location.pathname !== '/login' 
			? <Redirect to="/login" />
			: null
}

export default inject(injectUserStore)(observer(HomePage))