import React from 'react'
import { IUserStore } from '../../stores/UserStore'
import { injectUserStore } from '../../stores/RootStore'
import { observer, inject } from 'mobx-react'
import { DivProps } from '../../util/types'

interface IProps extends Pick<DivProps, 'children'> {
	userStore: IUserStore
}

interface IAuthContext {
	isAuthenticated: boolean
	isLoading: boolean
}

const { Provider, Consumer } = React.createContext<IAuthContext>({ isLoading: true, isAuthenticated: false })

export const AuthProvider = inject(injectUserStore)(observer(({ userStore, children }: IProps) => {
	const { isAuthenticated, isLoading } = userStore
	const context = {
		isAuthenticated,
		isLoading,
	}

	return (
		<Provider value={context}>
			{children}
		</Provider>
	)
}))

export { Consumer as AuthConsumer }
