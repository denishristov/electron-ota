import * as Sentry from '@sentry/browser'
import React from 'react'
import { configure } from 'mobx'

if (process.env.NODE_ENV === 'production') {
	Sentry.init({
		dsn: 'https://d841af74f80749068c383ece0987aaaa@sentry.codemotionapps.com/13',
	})
}

if (process.env.NODE_ENV !== 'production') {
	// tslint:disable-next-line:no-var-requires
	require('@welldone-software/why-did-you-render')(React, { onlyLogs: true })

	configure({
		computedRequiresReaction: true,
		enforceActions: 'always',
		isolateGlobalState: true,
	})
}

import './index'
