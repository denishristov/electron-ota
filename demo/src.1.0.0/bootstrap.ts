import ElectronUpdateServiceClient from 'electron-ota'

declare global {
	namespace NodeJS {
		// tslint:disable-next-line:interface-name
		interface Global {
			updateService: ElectronUpdateServiceClient,
			isDevMode: boolean,
		}
	}
}

global.isDevMode = /[\\/]electron[\\/]/u.test(process.execPath)

!global.isDevMode && (global.updateService = new ElectronUpdateServiceClient({
	bundleId: 'test-electron',
	updateServerUrl: 'http://localhost:4000',
	versionName: require('../package.json').version,
}))

if (global.isDevMode || !global.updateService.loadLatestUpdateSync()) {
	import('./main')
}
