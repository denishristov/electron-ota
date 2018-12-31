import bluebird from 'bluebird'
import mongoose from 'mongoose'

import { MONGODB_URI } from './config'

mongoose.Promise = bluebird
mongoose.set('useCreateIndex', true)
mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
	.catch((err) => {
	// tslint:disable-next-line:no-console
	console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err)
	process.exit(1)
})

export {}
