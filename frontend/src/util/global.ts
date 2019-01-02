import bindDecorator from 'bind-decorator'
import { inject, injectable } from 'inversify'
import { Api, Connection, Stores } from '../dependencies/symbols'

interface IDI {
	inject: typeof inject
	injectable: typeof injectable
	Api: typeof Api
	Connection: typeof Connection
	Stores: typeof Stores
}

declare global {
	const bind: typeof bindDecorator
	const DI: IDI
}

const DI = {
	inject,
	injectable,
	Api,
	Connection,
	Stores,
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
