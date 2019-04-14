import React from 'react'
import { IUserStore } from '../../stores/UserStore'
import { observer } from 'mobx-react'
import { DivProps } from '../../util/types'

interface IAuthContext {
	isAuthenticated: boolean
	isLoading: boolean
}

const { Provider, Consumer } = React.createContext<IAuthContext>({ isLoading: true, isAuthenticated: false })

@observer
export class AuthProvider extends React.Component<Pick<DivProps, 'children'>> {
	@lazyInject(nameof<IUserStore>())
	private readonly userStore: IUserStore

	public render() {
		const { isAuthenticated, isLoading } = this.userStore

		const context = {
			isAuthenticated: Boolean(isAuthenticated),
			isLoading,
		}

		return (
			<Provider value={context}>
				{this.props.children}
			</Provider>
		)
	}
}

export { Consumer as AuthConsumer }
