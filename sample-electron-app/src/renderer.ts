// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

// document.write('from renderer')
import UpdateService from 'electron-client'

const updateService = new UpdateService({
	bundleId: 'test-electron',
	url: 'http://localhost:4000',
})

updateService.onConnection(() => {
	document.write('connected')
})
updateService.onNewUpdate((da: object) => {
	document.write(JSON.stringify(da))
})
// tslint:disable-next-line:no-console
console.log(updateService)
