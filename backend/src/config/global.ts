import bindDecorator from 'bind-decorator'
import { inject, injectable } from 'inversify'
import * as Symbols from '../dependencies/symbols'

type SymbolType = typeof Symbols

interface IDI extends SymbolType {
	inject: typeof inject
	injectable: typeof injectable
}

declare global {
	const bind: typeof bindDecorator
	const DI: IDI
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
