import 'reflect-metadata'
import * as tsNameOf from 'ts-nameof'

import 'shared/dist/extensions'

import './config/global'
import './config/mongoose'

import container from './config/inversify.config'

import { SystemType } from 'shared'
import { ISocketMediator } from './util/mediator/interfaces'

import { ClientsMediatorFactory } from './mediators/ClientsMediatorFactory'
import { AdminMediatorFactory } from './mediators/AdminMediatorFactory'

import { IAppService } from './services/AppService'
// import Seed from './config/seed'

(async function bootstrap() {
	const mediators = container.get<Map<string, ISocketMediator>>(nameof<Map<string, ISocketMediator>>())

	const adminMediatorFactory = container.get<AdminMediatorFactory>(nameof<AdminMediatorFactory>())
	const clientsMediatorFactory = container.get<ClientsMediatorFactory>(nameof<ClientsMediatorFactory>())

	const adminMediator = adminMediatorFactory()
	mediators.set(adminMediator.name, adminMediator)

	const appService = container.get<IAppService>(nameof<IAppService>())
	const bundleIds = await appService.getAllBundleIds()

	const systemTypes = Object.keys(SystemType) as SystemType[]
	// const a = container.get<Seed>(nameof<Seed>())
	// a.seed()

	for (const bundleId of bundleIds) {
		for (const systemType of systemTypes) {
			const mediator = clientsMediatorFactory(bundleId, systemType)
			mediators.set(mediator.name, mediator)
		}
	}
}())
