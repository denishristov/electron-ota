import bluebird from 'bluebird'
import bodyParser from 'body-parser'
import compression from 'compression'
import errorHandler from 'errorhandler'
import express from 'express'
import lusca from 'lusca'
import mongoose from 'mongoose'
import path from 'path'
import socketio from 'socket.io'
import { EventTypes } from 'shared'

import UserManager from './managers/UserManager'
import { UserDocument } from './models/User'

import { MONGODB_URI } from './util/env'
import ClientSocket from './util/ClientSocket';
import UserService from './services/UserService';


// Create Express server
const app = express()

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
(<any>mongoose).Promise = bluebird
mongoose.connect(mongoUrl, { useNewUrlParser: true }).then(
	() => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch(err => {
	console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err)
	// process.exit();
})

// const db = mongoose.connection

// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
// 	console.log(db)
	
// });

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

io.on('connection', function(client) {
	const clientSocket = new ClientSocket(client)
	const userService = new UserService()
	const userManager = new UserManager(clientSocket, userService)
	// console.log('connection', ...arguments)
	client.on('error', function() {
		console.log('error', ...arguments)
	})
	// client.on('disconnect', function() {
	// 	console.log('disconnect', ...arguments)
	// })
	// client.on(EventTypes.Login, userManager.handleLogin)
})

require('./util/extensions')


export default app