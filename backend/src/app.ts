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

(async function setup() {
	container.get(DI.Mediators.Admins)
	container.get<Server>(DI.HTTPServer).listen(PORT, () => {
		// tslint:disable-next-line:no-console
		console.log(
			'App is running at http://localhost:%d in %s mode',
			PORT,
			ENVIRONMENT,
		)
	})

	const appService = container.get<IAppService>(DI.Services.App)
	const clientsMediatorFactory = container.get<ClientsMediatorFactory>(DI.Factories.ClientsMediator)
	const clientMediators = container.get<Map<string, ISocketMediator>>(DI.Mediators.Clients)

	const bundleIds = await appService.getAllBundleIds()

	for (const bundleId of bundleIds) {
		// container.bind<ISocketMediator>(DI.Mediators.Clients).toConstantValue(clientsMediatorFactory(bundleId)).w
		clientMediators.set(bundleId, clientsMediatorFactory(bundleId))
	}
}())
