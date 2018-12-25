import http from 'http'
import bluebird from 'bluebird'
import mongoose from 'mongoose'
import socketio from 'socket.io'

import 'reflect-metadata'

import { MONGODB_URI } from './util/env'

import MediatorBuilder from './util/mediator/MediatorBuilder'

import container from './dependencies/inversify.config'
import { Handlers, Services } from './dependencies/symbols'
import { IHandler } from './util/mediator/Interfaces'

import { IAppModel, EventType } from 'shared'
import { IAppService } from './services/AppService'
import { IVersionService } from './services/VersionService'
import AuthHook from './handlers/hooks/AuthHook'
import ReleaseUpdateHook from './handlers/hooks/ReleaseUpdateHook'

// Connect to MongoDB
const mongoUrl = MONGODB_URI
mongoose.Promise = bluebird
mongoose.set('useCreateIndex', true)
mongoose.connect(mongoUrl, { useNewUrlParser: true })
	.catch((err) => {
	// tslint:disable-next-line:no-console
	console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err)
	process.exit(1)
})

const server = http.createServer()

const io = socketio(server)

const port = process.env.PORT || 4000
server.listen(port, () => {
	// tslint:disable-next-line:no-console
	console.log(
		'App is running at http://localhost:%d in %s mode',
		port,
		process.env.NODE_ENV || 'dev',
	)
})

const userHandlers: IHandler[] = [
	...Object.values(Handlers.User),
	Handlers.App.Get,
	Handlers.Version.Get,
	Handlers.S3.SignUploadVersion,
	Handlers.S3.SignUploadPicture,
].map((x) => container.get<IHandler>(x))

const authHook = new AuthHook(container.get(Handlers.User.Authentication))

const adminsNamespace = io.of('/admins')
const adminRoom = adminsNamespace.in('admins')
const userMediator = MediatorBuilder.buildMediator(adminRoom, userHandlers, [authHook])

const adminHandlers: IHandler[] = [
	Handlers.App.Create,
	Handlers.App.Update,
	Handlers.App.Delete,
	Handlers.Version.Create,
	Handlers.Version.Update,
	Handlers.Version.Delete,
	Handlers.Version.Publish,
].map((x) => container.get<IHandler>(x))

adminsNamespace.on('connection', userMediator.subscribe.bind(userMediator))
const adminMediator = MediatorBuilder.buildNamespaceMediator(adminsNamespace, adminHandlers, [authHook])

const versionService = container.get<IVersionService>(Services.Version)

container.get<IAppService>(Services.App).getApps().then(({ apps }) => {
	apps.forEach((app) => {
		const namespace = io.of(`/${app.bundleId}`)
		// this.appUpdateService = new AppUpdateService(app, versionService)

		// const handlers: IHandler[] = [
		// 	new CheckForUpdateHandler(this.appUpdateService),
		// 	// new SuccessfulUpdateHandler(),
		// ]

		// this.clientsMediator = MediatorBuilder.buildNamespaceMediator(this.namespace, handlers, [])

		namespace.on(EventType.Connection, (appClient: SocketIO.Socket) => {
			const roomName: string = appClient.handshake.query.type

			appClient.join(roomName, () => {
				// tslint:disable-next-line:no-console
				console.log('client joined room ' + roomName)
			})

		})

		adminMediator.usePostRespond(new ReleaseUpdateHook(namespace.in('darwin'), versionService))
		// adminMediator.usePostRespond(new ReleaseUpdateHook(room, versionService))
		// adminMediator.usePostRespond(new ReleaseUpdateHook(room, versionService))
	})
})
