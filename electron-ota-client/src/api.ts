import { IApiConfig, IRegistrationResponse, IApi, IUpdateResponse } from './interfaces'
import os from 'os'
import { Server } from './enums'
import { timeout } from './functions'
import io from 'socket.io-client'

export default class Api implements IApi {
	private readonly connect: Promise<SocketIOClient.Socket>

	private readonly emitTimeout: number

	constructor(private readonly options: IApiConfig) {
		const { updateServerUrl, bundleId, versionName, emitTimeout } = options
		this.emitTimeout = emitTimeout

		this.connect = Promise.resolve().then(() => io(
			`${updateServerUrl}/${bundleId}/${os.type()}`,
			{
				query: `versionName=${versionName}`,
				reconnectionDelayMax: 60 * 60 * 1000,
				transports: ['websocket', 'xhr-polling'],
			},
		))
	}

	public on<T = {}>(eventType: Server, callback: (data: T) => void): this {
		this.connect.then((io) => io.on(eventType, callback))

		return this
	}

	public async dispose() {
		const connection = await this.connect

		connection.removeAllListeners()
		connection.close()
	}

	public register() {
		return this.emit<IRegistrationResponse>(Server.Register, {
			systemType: os.type(),
			username: os.userInfo().username,
			osRelease: os.release(),
		})
	}

	public checkForUpdate() {
		const { versionName, bundleId } = this.options

		return this.emit<IUpdateResponse>(
			Server.CheckForUpdate,
			{
				versionName,
				bundleId,
				systemType: os.type(),
			},
		)
	}

	public reportDownloading(clientId: string, versionId: string) {
		return this.report(Server.Downloading, clientId, versionId)
	}

	public reportDownloaded(clientId: string, versionId: string) {
		return this.report(Server.Downloaded, clientId, versionId)
	}

	public reportUsing(clientId: string, versionId: string) {
		return this.report(Server.Using, clientId, versionId)
	}

	public reportError(clientId: string, versionId: string, error: string) {
		return this.report(Server.Error, clientId, versionId, error)
	}

	private report(eventType: Server, clientId: string, versionId: string, error?: string) {
		return this.emit(eventType, {
			id: clientId,
			versionId,
			error,
			timestamp: new Date(),
		})
	}

	private async emit<T = {}>(eventType: Server, data?: object): Promise<T> {
		const response = new Promise<T>((resolve) => {
			this.connect.then((connection) => {
				connection.emit(eventType, data, resolve)
			})
		})

		return Promise.race([response, timeout(this.emitTimeout)])
	}
}
