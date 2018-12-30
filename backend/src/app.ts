// tslint:disable:no-console
import http from 'http'
import bluebird from 'bluebird'
import mongoose from 'mongoose'
import './util/global'

import 'reflect-metadata'
import container from './dependencies/inversify.config'

import {
	MONGODB_URI,
	ENVIRONMENT,
	PORT,
} from './config/config'

import { UpdateClientsMediatorFactory } from './mediator/MediatorFactory'
import { IAppService } from './services/AppService'

mongoose.Promise = bluebird
mongoose.set('useCreateIndex', true)
mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
	.catch((err) => {
	console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err)
	process.exit(1)
})

container.get<http.Server>(DI.HTTPServer).listen(PORT, () => {
	console.log(
		'App is running at http://localhost:%d in %s mode',
		PORT,
		ENVIRONMENT,
	)
})

container.get(DI.Mediators.Admins)

container.get<IAppService>(DI.Services.App).getAllApps().then(({ apps }) => {
	const updateClientsMediatorFactory = container.get<UpdateClientsMediatorFactory>(DI.Factories.ClientsMediator)

	for (const app of apps) {
		updateClientsMediatorFactory(app)
	}
})
