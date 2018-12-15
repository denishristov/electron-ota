import bluebird from 'bluebird'
import bodyParser from 'body-parser'
import compression from 'compression'
import errorHandler from 'errorhandler'
import express from 'express'
import lusca from 'lusca'
import mongoose from 'mongoose'
import socketio from 'socket.io'

import 'reflect-metadata'
import './dependencies/inversify.config'

import { EventType } from 'shared'

import { MONGODB_URI } from './util/env'

import MediatorBuilder from './util/mediator/MediatorBuilder'

import UserLoginHandler from './handlers/user/UserLoginHandler'
import UserAuthenticationHandler from './handlers/user/UserAuthenticationHandler'

import GetAppsHandler from './handlers/apps/GetAppsHandler'
import CreateAppHandler from './handlers/apps/CreateAppHandler'
import UpdateAppHandler from './handlers/apps/UpdateAppHandler'
import DeleteAppHandler from './handlers/apps/DeleteAppHandler'


import GetVersionsHandler from './handlers/version/GetVersionsHandler';
import CreateVersionHandler from './handlers/version/CreateVersionHandler';
import UpdateVersionHandler from './handlers/version/UpdateVersionHandler';
import DeleteVersionHandler from './handlers/version/DeleteVersionHandler';
import { IHandler } from './util/mediator/Interfaces';

require('./util/extensions')

// Create Express server
const app = express()

// Connect to MongoDB
const mongoUrl = MONGODB_URI
mongoose.Promise = bluebird
mongoose.set('useCreateIndex', true)
mongoose.connect(mongoUrl, { useNewUrlParser: true })
	.catch(err => {
	console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err)
	// process.exit()
})

// const db = mongoose.connection

// db.on('error', console.error.bind(console, 'connection error:'))
// db.once('open', function() {
// 	console.log(db)
	
// })

// Express configuration
app.set('port', process.env.PORT || 4000)
// app.set('views', path.join(__dirname, '../views'))
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))

/**
 * Primary app routes.
 */
app.get('/', (_, res) => {
	res.sendStatus(204)
})


/**
 * Error Handler. Provides full stack - remove for production
 */
process.env.NODE_ENV !== 'production' && app.use(errorHandler())

const server = require('http').createServer(app)

/**
 * Start Express server.
 */
server.listen(app.get('port'), () => {
	console.log(
		'App is running at http://localhost:%d in %s mode',
		app.get('port'),
		app.get('env')
	)
})


const io = socketio(server)

// const  = new UserService()
// const  = new AppService()
// const  = new VersionService()

const userHandlers: IHandler[] = [
	new UserLoginHandler(),
	new UserAuthenticationHandler(),
	new GetAppsHandler(),
	new GetVersionsHandler(),
]

const authHook = { 
	exceptions: [EventType.Login, EventType.Authentication, EventType.Connection],
	handle: async (eventType: EventType, data: any) => {
		const { isAuthenticated } = await userHandlers[1].handle(data)
		// console.log(eventType, 'is auth', isAuthenticated, data)
		if (isAuthenticated) {
			return data
		}
	},
}

const userMediator = MediatorBuilder.buildMediator(userHandlers, [authHook])

const adminHandlers = [
	new CreateAppHandler(),
	new UpdateAppHandler(),
	new DeleteAppHandler(),
	new CreateVersionHandler(),
	new UpdateVersionHandler(),
	new DeleteVersionHandler()
]

const adminsNamespace = io.of('/admins')
adminsNamespace.on('connection', userMediator.subscribe.bind(userMediator))
MediatorBuilder.buildNamespaceMediator(adminsNamespace, adminHandlers, [authHook])

export default app