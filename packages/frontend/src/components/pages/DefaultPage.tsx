import React from 'react'
import { Redirect } from 'react-router'
import Loading from '../generic/Loading'
import { AuthConsumer } from '../contexts/AuthProvider'

export default function DefaultPage() {
	return (
		<AuthConsumer>
			{({ isLoading, isAuthenticated }) => {
				return isLoading
					? <Loading />
					: isAuthenticated
						? <Redirect push to='/apps' />
						: <Redirect push to='/login' />

			}}
		</AuthConsumer>
	)
}
