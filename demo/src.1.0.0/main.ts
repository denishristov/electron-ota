import { app, BrowserWindow, dialog } from 'electron'
import * as path from 'path'

let mainWindow: Electron.BrowserWindow

if (!global.isDevMode) {
	global.updateService.checkForUpdate()

	global.updateService.on('update', () => {
		dialog.showMessageBox({
			buttons: ['Reload', 'Not now'] ,
			message: 'A new update is available',
			type: 'question',
		}, (index) => {
			if (index === 0) {
				// TODO: Set launch URL to be the same
				mainWindow.reload()
				// app.relaunch()
				// app.exit()
			}
		})
	})
}

function createWindow() {
	mainWindow = new BrowserWindow({
		height: 600,
		width: 800,
	})

	mainWindow.loadFile(path.join(__dirname, '../index.html'))

	// mainWindow.webContents.openDevTools()

	mainWindow.on('closed', () => {
		mainWindow = null
	})
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow()
	}
})
