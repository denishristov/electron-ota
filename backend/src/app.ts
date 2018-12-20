import bluebird from 'bluebird'
import mongoose from 'mongoose'
import socketio from 'socket.io'

import 'reflect-metadata'

import { EventType } from 'shared'

import { MONGODB_URI } from './util/env'

import MediatorBuilder from './util/mediator/MediatorBuilder'

import container from './dependencies/inversify.config'
import { Handlers, Services } from './dependencies/symbols'
import { IHandler } from './util/mediator/Interfaces'

// import './util/extensions'

import http from 'http'
import { IAppModel, IUserAuthenticationResponse } from 'shared'
import { IAppDocument } from './models/App'
import AppClientService from './services/AppClientService'
import { IAppService } from './services/AppService'

// Connect to MongoDB
const mongoUrl = MONGODB_URI
mongoose.Promise = bluebird
mongoose.set('useCreateIndex', true)
mongoose.connect(mongoUrl, { useNewUrlParser: true })
	.catch((err) => {
	// tslint:disable-next-line:no-console
	console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err)
	// process.exit()
})

// const db = mongoose.connection

// db.on('error', console.error.bind(console, 'connection error:'))
// db.once('open', function() {
// 	console.log(db)

// })

const server = http.createServer()

const io = socketio(server)

const port = process.env.PORT || 4000
server.listen(port, () => {
	// tslint:disable-next-line:no-console
	console.log(
		'App is running at http://localhost:%d in %s mode',
		port,
		process.env.NODE_ENV,
	)
})

const userHandlers: IHandler[] = [
	...Object.values(Handlers.User),
	Handlers.App.Get,
	Handlers.Version.Get,
	Handlers.S3.SignUploadVersion,
	Handlers.S3.SignUploadPicture,
].map((x) => container.get<IHandler>(x))

const authHook = {
	exceptions: [EventType.Login, EventType.Authentication, EventType.Connection],
	handle: async (_: EventType, data: object) => {
		// tslint:disable-next-line:no-console
		console.log('hook')
		const { isAuthenticated } = await userHandlers[0].handle(data) as IUserAuthenticationResponse

		if (isAuthenticated) {
			return data
		}
	},
}

const userMediator = MediatorBuilder.buildMediator(userHandlers, [authHook])

const adminHandlers: IHandler[] = [
	Handlers.App.Create,
	Handlers.App.Update,
	Handlers.App.Delete,
	Handlers.Version.Create,
	Handlers.Version.Update,
	Handlers.Version.Delete,
].map((x) => container.get<IHandler>(x))

const adminsNamespace = io.of('/admins')
adminsNamespace.on('connection', userMediator.subscribe.bind(userMediator))
MediatorBuilder.buildNamespaceMediator(adminsNamespace, adminHandlers, [authHook])

container.get<IAppService>(Services.App).getApps().then(({apps}) => {
	const a: IAppModel[] = Object.values(apps)
	a.forEach((app) => new AppClientService(app, io))
})
