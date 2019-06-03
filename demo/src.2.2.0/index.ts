import { app, BrowserWindow, dialog } from 'electron'
import * as path from 'path'
import ElectronOTA from 'electron-ota-client'

dialog
let mainWindow: Electron.BrowserWindow

ElectronOTA.on('update', (update) => {
	dialog.showMessageBox({
		buttons: ['Reload', 'Not now'],
		message: `A new update is available:
${Object.entries(update).map(([k, v]) => `${k}: ${v}`).join('\n')}
		`,
		type: 'question',
	}, (index) => {
		if (index === 0) {
			app.relaunch()
			app.exit(0)
		}
	})
}).on('error', console.warn)

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

	ElectronOTA.checkForUpdate()
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

