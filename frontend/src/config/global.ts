import bindDecorator from 'bind-decorator'
import { inject, injectable } from 'inversify'
import * as Symbols from '../dependencies/symbols'
import SVGComponent from '../components/generic/SVG'

type SymbolType = typeof Symbols

interface IDI extends SymbolType {
	inject: typeof inject
	injectable: typeof injectable
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
