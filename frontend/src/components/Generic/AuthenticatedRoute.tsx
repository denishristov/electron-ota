import React from 'react'
import { Route, Redirect, RouteProps, RouteComponentProps, StaticContext } from 'react-router'
import { AuthConsumer } from '../Context/AuthProvider'
import Loading from './Loading'

export default function AuthenticatedRoute({ render, component: Component, ...props }: RouteProps) {
	function renderer(props: RouteComponentProps<{}, StaticContext, {}>) {
		return (
			<AuthConsumer>
				{({ isLoading, isAuthenticated }) => {
					return isLoading
						? <Loading />
						: isAuthenticated
							? Component
								? <Component {...props} />
								: render
									? render(props)
									: <Redirect to='/apps' />
							: <Redirect to='/login' />
				}}
			</AuthConsumer>
		)
	}

	return (
		<Route {...props} render={renderer} />
	)
}
