import * as React from "react"
import { Omit } from "typelevel-ts"

declare module "mobx-react" {
	export function inject<D extends object>(
		mapStoreToProps: (stores: any) => D
	): <A extends D>(
		component: React.ComponentType<A>
	) => React.SFC<Omit<A, keyof D> & Partial<D>>
}

export {}