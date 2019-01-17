import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { injectUserStore } from '../../stores/RootStore'
import { Route, Redirect, RouteProps, RouteComponentProps, StaticContext } from 'react-router'
import { IUserStore } from '../../stores/UserStore'

// tslint:disable:no-any
interface IProps extends RouteComponentProps<any, StaticContext, any> {
	userStore: IUserStore
	// tslint:disable-next-line:max-line-length
	component: React.ComponentClass<any, any> | React.FunctionComponent<any> | React.ComponentClass<RouteComponentProps<any, StaticContext, any>, any> | React.FunctionComponent<RouteComponentProps<any, StaticContext, any>> | undefined
	render: ((props: RouteComponentProps<any, StaticContext, any>) => React.ReactNode) | undefined
}

// tslint:disable-next-line:variable-name
const AuthRenderer = inject(injectUserStore)(observer(({ component, render, userStore, ...props }: any) => {
	// tslint:disable-next-line:variable-name
	const Component = component as React.ComponentClass

	return userStore.isLoading
		? <div>Loading</div>
		: userStore.isAuthenticated
			? Component
				? <Component {...props} />
				: render
					? render(props)
					: null
			: <Redirect to='/login' />
}))

function AuthenticatedRoute({ component, render, ...props}: RouteProps) {
	return <Route {...props} render={(props) =>
		<AuthRenderer component={component} render={render} {...props} />
	} />
}

export default AuthenticatedRoute
