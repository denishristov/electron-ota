import io from 'socket.io-client'
import fs from 'fs'
import download from 'download'
import os from 'os'
import path from 'path'

interface IUpdateServiceOptions {
	bundleId: string
	updateServerUrl: string
	userDataPath: string
}

interface IUpdateResponse {
	isUpToDate: boolean
	downloadUrl?: string
}

interface INewUpdate {
	downloadUrl: string
}

enum EventType {
	Connect = 'connect',
	CheckForUpdate = 'update.check',
	NewUpdate = 'update.new',
}

declare global {
	namespace NodeJS {
		interface Process {
			noAsar?: boolean
		}
	}
}

export default class UpdateService {
	private readonly connection: SocketIOClient.Socket
	private readonly updateDirPath: string

	constructor(options: IUpdateServiceOptions) {
		this.updateDirPath = path.join(options.userDataPath, 'updates')

		fs.exists(this.updateDirPath, exists => {
			!exists && fs.mkdir(this.updateDirPath, () => {})
		})

		this.connection = io(`${options.updateServerUrl}/${options.bundleId}`, {
			query: `type=${os.platform()}`
		})

		this.connection.on(EventType.Connect, () => {
			console.log('conencted')
			this.connection.emit(EventType.CheckForUpdate)
		})

		console.log('wow')

		this.connection.on(EventType.CheckForUpdate, (res: IUpdateResponse) => {
			if (!res.isUpToDate && Boolean(res.downloadUrl)) {
				this.downloadUpdate(res.downloadUrl)
			}
		})

		this.connection.on(EventType.NewUpdate, (res: INewUpdate) => {
			this.downloadUpdate(res.downloadUrl)
		})
	}

	private async downloadUpdate(url: string) {
		const fileName = `${+new Date()}.asar`
		const filePath = path.join(this.updateDirPath, fileName)

		process.noAsar = true

		const file = await download(url)
		fs.writeFileSync(filePath, file)

		process.noAsar = false

		return fileName
	}

	onConnection(ack: (data: object) => void) {
		this.connection.on(EventType.Connect, ack)
	}

	onNewUpdate(ack: (data: object) => void) {
		this.connection.on(EventType.NewUpdate, ack)
	}
}