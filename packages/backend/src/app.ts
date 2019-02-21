import 'reflect-metadata'

import 'shared/dist/extensions'

import './config/global'
import './config/mongoose'

import container from './config/inversify.config'

import { SystemType } from 'shared'
import { ISocketMediator } from './util/mediator/interfaces'

import { ClientsMediatorFactory } from './mediators/ClientsMediatorFactory'
import { AdminMediatorFactory } from './mediators/AdminMediatorFactory'

import { IAppService } from './services/AppService'

(async function bootstrap() {
	const mediators = container.get<Map<string, ISocketMediator>>(DI.Mediators)

	const adminMediatorFactory = container.get<AdminMediatorFactory>(DI.Factories.AdminsMediator)
	const clientsMediatorFactory = container.get<ClientsMediatorFactory>(DI.Factories.ClientsMediator)

	const adminMediator = adminMediatorFactory()
	mediators.set(adminMediator.name, adminMediator)

	const appService = container.get<IAppService>(DI.Services.App)
	const bundleIds = await appService.getAllBundleIds()

	const systemTypes = Object.keys(SystemType) as SystemType[]

	for (const bundleId of bundleIds) {
		for (const systemType of systemTypes) {
			const mediator = clientsMediatorFactory(bundleId, systemType)
			mediators.set(mediator.name, mediator)
		}
	}
}())
