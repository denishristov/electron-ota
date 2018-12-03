import bluebird from 'bluebird'
import bodyParser from 'body-parser'
import compression from 'compression'
import express from 'express'
import lusca from 'lusca'
import mongoose from 'mongoose'
import path from 'path'

import { MONGODB_URI } from './util/env'


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

// Express configuration
app.set('port', process.env.PORT || 4000)
app.set('views', path.join(__dirname, '../views'))
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

export default app