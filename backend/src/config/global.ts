import bindDecorator from 'bind-decorator'
import { inject, injectable } from 'inversify'
import * as Symbols from '../util/symbols'
import { InstanceType } from 'typegoose'
import { ObjectID } from 'bson'

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

declare global {
	type Ref<T> = InstanceType<T> | ObjectID
}

const DI = {
	inject,
	injectable,
	...Symbols,
}

global.bind = bindDecorator
global.DI = DI

export {}
