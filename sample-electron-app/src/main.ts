import { app, BrowserWindow, dialog } from 'electron'
import * as path from 'path'
import config from './update.config'
import ElectronUpdateServiceClient from 'electron-client'

const updateService = new ElectronUpdateServiceClient(config)

if (!updateService.loadLatestUpdateSync()) {
	(function main() {
		let mainWindow: Electron.BrowserWindow

		updateService.checkForUpdate()

		updateService.on('update', (info) => {
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
	})()
}
