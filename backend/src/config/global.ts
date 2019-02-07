import bindDecorator from 'bind-decorator'
import { inject, injectable } from 'inversify'
import * as Symbols from '../util/symbols'
import { InstanceType } from 'typegoose'
import { ObjectID } from 'bson'

type SymbolType = typeof Symbols

interface IDI extends SymbolType {
	inject: typeof inject
	injectable: typeof injectable
}

declare global {
	const bind: typeof bindDecorator
	const DI: IDI
}

declare global {
	type Ref<T> = InstanceType<T> | ObjectID
}

const DI = {
	inject,
	injectable,
	...Symbols,
}

Object.defineProperties(global, {
	bind: {
		value: bindDecorator,
	},
	DI: {
		value: DI,
	},
})

export {}
