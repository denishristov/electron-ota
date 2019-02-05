import { app, BrowserWindow, dialog } from 'electron'
import * as path from 'path'
import './update.config'
import yes from '../package.json'
import ElectronUpdateServiceClient from 'electron-client'

const config = {
	bundleId: 'test-electron',
	updateServerUrl: 'http://localhost:4000',
	versionName: yes.version,
}
console.log(yes.version, 'yess')
const updateService = new ElectronUpdateServiceClient(config)


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
const u = updateService.loadLatestUpdateSync()
console.log(u)
if (!u) {
	main()
}

updateService.checkForUpdate()
function main() {
	let mainWindow: Electron.BrowserWindow

	function createWindow() {
		// Create the browser window.
		mainWindow = new BrowserWindow({
			height: 600,
			width: 800,
		})

		// and load the index.html of the app.
		mainWindow.loadFile(path.join(__dirname, '../../index.html'))

		// Open the DevTools.
		mainWindow.webContents.openDevTools()

		// Emitted when the window is closed.
		mainWindow.on('closed', () => {
			// Dereference the window object, usually you would store windows
			// in an array if your app supports multi windows, this is the time
			// when you should delete the corresponding element.
			mainWindow = null
		})
	}
	// This method will be called when Electron has finished
	// initialization and is ready to create browser windows.
	// Some APIs can only be used after this event occurs.
	app.on('ready', createWindow)

	// Quit when all windows are closed.
	app.on('window-all-closed', () => {
		// On OS X it is common for applications and their menu bar
		// to stay active until the user quits explicitly with Cmd + Q
		if (process.platform !== 'darwin') {
			app.quit()
		}
	})

	app.on('activate', () => {
		// On OS X it"s common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (mainWindow === null) {
			createWindow()
		}
	})
}
