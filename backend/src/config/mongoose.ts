// tslint:disable:no-console
import bluebird from 'bluebird'
import mongoose from 'mongoose'
import chalk from 'chalk'

import { MONGODB_URI } from '.'

const connected = chalk.bold.cyan
const error = chalk.bold.yellow
const disconnected = chalk.bold.red
const termination = chalk.bold.magenta

mongoose.Promise = bluebird
global.Promise = bluebird

mongoose.set('useCreateIndex', true)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })

mongoose.connection
	.on('connected', () => {
		console.log(connected('Mongoose default connection is open to ', MONGODB_URI))
	})
	.on('error', (err) => {
		console.log(error('Mongoose default connection has occurred ' + err + ' error'))
		process.exit(1)
	})
	.on('disconnected', () => {
		console.log(disconnected('Mongoose default connection is disconnected'))
		// process.exit(1)
	})

process.on('SIGINT', () => {
	mongoose.connection.close(() => {
		console.log(termination('Mongoose default connection is disconnected due to application termination'))
		process.exit(0)
	})
})

export {}
