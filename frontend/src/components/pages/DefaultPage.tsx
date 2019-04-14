import React from 'react'
import { Redirect } from 'react-router'
import Loading from '../generic/LoadingContainer'
import { AuthConsumer } from '../contexts/AuthProvider'

export default function DefaultPage() {
	return (
		<AuthConsumer>
			{({ isLoading, isAuthenticated }) => {
				return isLoading
					? <Loading />
					: <Redirect push to={isAuthenticated ? '/apps' : '/login'} />
			}}
		</AuthConsumer>
	)
}
