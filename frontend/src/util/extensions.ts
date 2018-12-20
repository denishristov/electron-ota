import * as React from 'react'
import { Omit } from 'typelevel-ts'
import { IRootStore } from '../stores/RootStore'

declare module 'mobx-react' {
	export function inject<D extends object>(mapStoreToProps: (store: IRootStore) => D):
		<A extends D>(component: React.ComponentType<A> | React.SFC<A>) =>
			React.SFC<Omit<A, keyof D> & Partial<D>> & IWrappedComponent<A>
}

export {}
