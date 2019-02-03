import 'shared/dist/extensions'
import './config/global'
import './config/mongoose'

import 'reflect-metadata'
import container from './dependencies/inversify.config'

import { ClientsMediatorFactory } from './dependencies/factories/ClientsMediatorFactory'
import { IAppService } from './services/AppService'
import { ISocketMediator } from './util/mediator/interfaces'
import { Server } from 'http'
import { PORT, ENVIRONMENT } from './config/config'

import { AdminMediatorFactory } from './dependencies/factories/AdminMediatorFactory'
import { SystemType } from 'shared'

(async function setup() {
	const mediators = container.get<Map<string, ISocketMediator>>(DI.Mediators)

	const adminMediator = container.get<AdminMediatorFactory>(DI.Factories.AdminsMediator)()

	mediators.set(adminMediator.name, adminMediator)

	const clientsMediatorFactory = container.get<ClientsMediatorFactory>(DI.Factories.ClientsMediator)

	const appService = container.get<IAppService>(DI.Services.App)
	const bundleIds = await appService.getAllBundleIds()

	const systemTypes = Object.keys(SystemType) as SystemType[]

	for (const bundleId of bundleIds) {
		for (const systemType of systemTypes) {
			const mediator = clientsMediatorFactory(bundleId, systemType)
			mediators.set(mediator.name, mediator)
		}
	}

	container.get<Server>(DI.HTTPServer).listen(PORT, () => {
		// tslint:disable-next-line:no-console
		console.log(
			'App is running at http://localhost:%d in %s mode',
			PORT,
			ENVIRONMENT,
		)
	})
}())
