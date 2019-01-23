import * as Sentry from '@sentry/node'

import { isProduction } from './config'

isProduction && Sentry.init({
	dsn: 'https://e40236b619084059bb10605cef5c9755@sentry.codemotionapps.com/12',
})

import './app'
