import React from 'react'
import { Redirect } from 'react-router'
import Loading from '../Generic/Loading'
import { AuthConsumer } from '../Context/AuthProvider'

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
