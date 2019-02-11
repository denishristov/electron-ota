import bindDecorator from 'bind-decorator'
import { inject, injectable, interfaces } from 'inversify'
import * as Symbols from '../dependencies/symbols'
import SVGComponent from '../components/generic/SVG'

type SymbolType = typeof Symbols

interface IDI extends SymbolType {
	inject: typeof inject
	injectable: typeof injectable
	// tslint:disable-next-line:max-line-length no-any
	lazyInject: (serviceIdentifier: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>) => (proto: any, key: string) => void
}

declare global {
	const bind: typeof bindDecorator
	const DI: IDI
	const SVG: typeof SVGComponent
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
	SVG: {
		value: SVGComponent,
	},
})

export {}
