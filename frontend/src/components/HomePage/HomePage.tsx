import React from 'react'
import { Redirect } from 'react-router'
import Login from './Login'
import { inject, observer } from 'mobx-react'

import { IHomePageProps } from './Interfaces'

const HomePage = ({ userStore }: IHomePageProps) => userStore.isAuthenticated 
	? <Redirect to="/applications" /> 
	: userStore.isLoading
		? <div>Loading...</div>
		: <Login />

export default inject(stores => ({ userStore: stores.userStore }))(observer(HomePage))