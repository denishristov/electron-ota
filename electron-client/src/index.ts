import io from 'socket.io-client'
import fs from 'fs'
import https from 'https'
import os from 'os'

interface IUpdateServiceOptions {
	bundleId: string
	url: string
}

interface IUpdateResponse {
	isUpToDate: boolean
	downloadUrl?: string
}

enum EventType {
	Connect = 'connect',
	CheckForUpdate = 'update.check',
	NewUpdate = 'update.new',
}

const UPDATE_FILE_NAME = 'update.asar'

export default class UpdateService {
	private readonly connection: SocketIOClient.Socket

	constructor(options: IUpdateServiceOptions) {
		this.connection = io(`${options.url}/${options.bundleId}`, {
			query: `type=${os.platform()}`
		})

		this.connection.on(EventType.Connect, () => {
			console.log('conencted')
			this.connection.emit(EventType.CheckForUpdate)
		})

		console.log('wow')

		this.connection.on(EventType.CheckForUpdate, (res: IUpdateResponse) => {
			if (!res.isUpToDate && Boolean(res.downloadUrl)) {

				const file = fs.createWriteStream(UPDATE_FILE_NAME)

				file.on('finish', () => {
					file.close()
				})

				https.get(res.downloadUrl, (response) => {
					response.pipe(file)
				}).on('error', () => {
					fs.unlink(UPDATE_FILE_NAME, () => {})
				})
			}
		})

		this.connection.on(EventType.NewUpdate, console.log)
	}

	onConnection(ack: (data: object) => void) {
		this.connection.on(EventType.Connect, ack)
	}

	onNewUpdate(ack: (data: object) => void) {
		this.connection.on(EventType.NewUpdate, ack)
	}
}