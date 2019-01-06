import bindDecorator from 'bind-decorator'
import { inject, injectable } from 'inversify'
import { Models, Services, Hooks, Factories, SocketServer, HTTPServer, Mediators } from '../dependencies/symbols'

interface IDI {
	inject: typeof inject
	injectable: typeof injectable
	Models: typeof Models
	Services: typeof Services
	Hooks: typeof Hooks
	Factories: typeof Factories
	SocketServer: typeof SocketServer
	HTTPServer: typeof HTTPServer
	Mediators: typeof Mediators
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
	Mediators,
	HTTPServer,
	SocketServer,
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
