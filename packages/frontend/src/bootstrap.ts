import * as Sentry from '@sentry/browser'

process.env.NODE_ENV === 'production' && Sentry.init({
	dsn: 'https://d841af74f80749068c383ece0987aaaa@sentry.codemotionapps.com/13',
})

import './index'
