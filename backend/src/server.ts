import errorHandler from 'errorhandler'

import app from './app'

/**
 * Error Handler. Provides full stack - remove for production
 */
process.env.NODE_ENV !== 'production' && app.use(errorHandler())

/**
 * Start Express server.
 */
const server = app.listen(app.get('port'), () => {
	console.log(
		'App is running at http://localhost:%d in %s mode',
		app.get('port'),
		app.get('env')
	)
})

export default server
