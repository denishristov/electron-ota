import 'reflect-metadata'
import './util/global'
import './config/mongoose'

import container from './dependencies/inversify.config'

import { Server } from 'http'
import { UpdateClientsMediatorFactory } from './mediator/MediatorFactory'
import { IAppService } from './services/AppService'

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

	const appService = container.get<IAppService>(DI.Services.App)
	const createClientsMediator = container.get<UpdateClientsMediatorFactory>(DI.Factories.ClientsMediator)

	const { apps } = await appService.getAllApps()

	for (const app of apps) {
		createClientsMediator(app)
	}
}

setup()
