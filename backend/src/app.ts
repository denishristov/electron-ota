import http from 'http'
import socketio from 'socket.io'
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

import { IMediatorFactory } from './mediator/MediatorFactory'
import { IAppService } from './services/AppService'

// tslint:disable:no-console

mongoose.Promise = bluebird
mongoose.set('useCreateIndex', true)
mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
	.catch((err) => {
	console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err)
	process.exit(1)
})

const server = http.createServer()
const io = socketio(server)

server.listen(PORT, () => {
	console.log(
		'App is running at http://localhost:%d in %s mode',
		PORT,
		ENVIRONMENT,
	)
})

const mediatorFactory = container.get<IMediatorFactory>(DI.Factories.Mediator)

const adminMediator = mediatorFactory.createAdminMediator(io.of('/admins'))

container.get<IAppService>(DI.Services.App).getApps().then(({ apps }) => {
	for (const app of apps) {
		mediatorFactory.createAppClientsMediator(io.of(`/${app.bundleId}`), adminMediator, app)
	}
})
