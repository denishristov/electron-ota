import 'shared/dist/extensions'
import './config/global'
import './config/mongoose'

import 'reflect-metadata'
import container from './dependencies/inversify.config'

import { Server } from 'http'
import { IAppService } from './services/AppService'
import { UpdateClientsMediatorFactory } from './dependencies/factories/UpdateClientsMediatorFactory'

import { ENVIRONMENT, PORT } from './config/config'

async function setup() {
	const httpServer = container.get<Server>(DI.HTTPServer)
	httpServer.listen(PORT, () => {
		// tslint:disable-next-line:no-console
		console.log(
			'App is running at http://localhost:%d in %s mode',
			PORT,
			ENVIRONMENT,
		)
	})

	container.get(DI.Mediators.Admins)

	const appService = container.get<IAppService>(DI.Services.App)
	const clientsMediatorFactory = container.get<UpdateClientsMediatorFactory>(DI.Factories.ClientsMediator)

	const { apps } = await appService.getAllApps()

	for (const app of apps) {
		clientsMediatorFactory(app)
	}
}

setup()
