import bindDecorator from 'bind-decorator'
import { inject, injectable } from 'inversify'
import { Models, Services, Hooks, Factories } from '../dependencies/symbols'

interface IDI {
	inject: typeof inject
	injectable: typeof injectable
	Models: typeof Models
	Services: typeof Services
	Hooks: typeof Hooks
	Factories: typeof Factories
}

declare global {
	const bind: typeof bindDecorator
	const DI: IDI
}

const DI = {
	inject,
	injectable,
	Models,
	Services,
	Hooks,
	Factories,
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
