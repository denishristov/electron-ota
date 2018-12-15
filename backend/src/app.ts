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

import { IHandler } from './util/mediator/Interfaces';
import container from './dependencies/inversify.config';
import { Handlers } from './dependencies/symbols';

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
	Handlers.App.Get,
	...Object.values(Handlers.User),
	Handlers.Version.Get
].map(x => container.get<IHandler>(x))

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

const adminHandlers: IHandler[] = [
	Handlers.App.Create,
	Handlers.App.Update,
	Handlers.App.Delete,
	Handlers.Version.Create,
	Handlers.Version.Update,
	Handlers.Version.Delete,
].map(x => container.get<IHandler>(x))

const adminsNamespace = io.of('/admins')
adminsNamespace.on('connection', userMediator.subscribe.bind(userMediator))
MediatorBuilder.buildNamespaceMediator(adminsNamespace, adminHandlers, [authHook])

export default app