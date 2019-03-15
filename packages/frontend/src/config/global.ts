import _bind from 'bind-decorator'
import { inject as _inject, injectable as _injectable, interfaces } from 'inversify'
import SVGComponent from '../components/generic/SVG'

declare global {
	// const nameof: <T>() => string
	const SVG: typeof SVGComponent
	const bind: typeof _bind
	const inject: typeof _inject
	const injectable: typeof _injectable
	// tslint:disable-next-line:max-line-length
	const lazyInject: (serviceIdentifier: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>) => (proto: any, key: string) => void
}

Object.defineProperties(global, {
	bind: {
		value: _bind,
	},
	inject: {
		value: _inject,
	},
	injectable: {
		value: _injectable,
	},
	SVG: {
		value: SVGComponent,
	},
})

export {}
