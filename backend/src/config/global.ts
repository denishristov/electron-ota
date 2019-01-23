import bindDecorator from 'bind-decorator'
import { inject, injectable } from 'inversify'
import { Models, Services, Hooks, Factories, SocketServer, HTTPServer, Mediators } from '../dependencies/symbols'

import Global = NodeJS.Global

interface IGlobal extends Global {
	bind: typeof bindDecorator
	DI: typeof DI
}

type DIType = typeof DI

declare const global: IGlobal

declare global {
	const bind: typeof bindDecorator
	const DI: DIType
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

global.bind = bindDecorator
global.DI = DI

export {}
