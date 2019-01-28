import { app, dialog } from 'electron'
import ElectronUpdateServiceClient from 'electron-client'

const config = {
	bundleId: 'test-electron',
	updateServerUrl: 'http://localhost:4000',
	versionName: app.getVersion(),
}

const updateService = new ElectronUpdateServiceClient(config)

// tslint:disable-next-line:no-console
console.log(app.getVersion())

updateService.on('update', (info) => {
	// tslint:disable-next-line:no-console
	console.log(info)
	dialog.showMessageBox({
		buttons: ['Reload', 'Not now'] ,
		message: 'A new update is available',
		type: 'question',
	},
	(index) => {
		if (index === 0) {
			app.relaunch()
			app.exit()
		}
	},
	)
})

// tslint:disable:no-console
// console.log(updateService.loadLatestUpdateSync())
// updateService.checkForUpdate()

export {}
