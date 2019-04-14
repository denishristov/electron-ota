import _bind from 'bind-decorator'
import { inject as _inject, injectable as _injectable } from 'inversify'
import { InstanceType } from 'typegoose'
import { ObjectID } from 'bson'

import Global = NodeJS.Global

interface IGlobal extends Global {
	bind: typeof _bind
	inject: typeof inject
	injectable: typeof _injectable
}

declare const global: IGlobal

declare global {
	const bind: typeof _bind
	const inject: typeof _inject
	const injectable: typeof _injectable
}

declare global {
	type Ref<T> = InstanceType<T> | ObjectID
}

global.bind = _bind
global.inject = _inject
global.injectable = _injectable

export {}
