import ElectronUpdateServiceClient from 'electron-client'

declare global {
	namespace NodeJS {
		// tslint:disable-next-line:interface-name
		interface Global {
			updateService: ElectronUpdateServiceClient
		}
	}
}

global.updateService = new ElectronUpdateServiceClient({
	bundleId: 'test-electron',
	updateServerUrl: 'http://localhost:4000',
	versionName: require('../package.json').version,
})

if (!global.updateService.loadLatestUpdateSync()) {
	import('./main')
}
