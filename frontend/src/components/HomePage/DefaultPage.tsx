import { inject, observer } from 'mobx-react'
import React from 'react'
import { Redirect } from 'react-router'
import { RouteComponentProps } from 'react-router'
import { injectUserStore } from '../../stores/RootStore'
import { IUserStore } from '../../stores/UserStore'

interface IDefaultPageProps extends RouteComponentProps {
	userStore: IUserStore
}

function DefaultPage({ userStore }: IDefaultPageProps) {
	return userStore.isLoading
		? <div></div>
		: userStore.isAuthenticated
			? <Redirect to='/apps' />
			: <Redirect to='/login' />
}

export default inject(injectUserStore)(observer(DefaultPage))
