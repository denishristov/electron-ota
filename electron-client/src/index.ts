import os from 'os'
import path from 'path'
import fs from 'fs'
import { EventEmitter } from 'events'

import download from 'download'
import semver from 'semver'
import Store from 'electron-store'
import { app } from 'electron'

import * as EventTypes from './EventTypes'
import {
	INewUpdate,
	IUpdateResponse,
	IUpdateInfo,
	IUpdateServiceOptions,
	IRegistrationResponse,
} from './Interfaces'
import {
	hashFile,
	readdir,
	unlink,
	hashFileSync,
	uuid,
	connect,
	exists,
} from './Functions'

declare global {
	namespace NodeJS {
		interface Process {
			noAsar?: boolean
		}
	}
}

declare interface ElectronUpdateServiceClient {
	on(event: 'update', listener: (info: IUpdateInfo) => void): this
	on(event: 'error', listener: (error: Error) => void): this
}

class ElectronUpdateServiceClient extends EventEmitter {

	private static readonly RETRY_TIMEOUT = 1000 * 60
	private static readonly EMIT_TIMEOUT = 1000 * 60
	private readonly updateDirPath: string
	private readonly versionName: string
	private clientId: string
	private readonly bundleId: string
	private readonly checkHashAfterDownload: boolean
	private readonly checkHashBeforeLoad: boolean
	private readonly downloadsStore = new Store({ name: 'updater' })
	private readonly sessionStore = new Store({ name: 'session '})
	private readonly connect: Promise<SocketIOClient.Socket>

	constructor({
		versionName,
		userDataPath,
		bundleId,
		updateServerUrl,
		checkHashAfterDownload,
		checkHashBeforeLoad,
	}: IUpdateServiceOptions) {
		super()

		this.clientId = this.sessionStore.get('clientId')
		this.bundleId = bundleId
		this.versionName = versionName
		this.updateDirPath = path.join(userDataPath || app.getPath('userData'), 'updates')

		this.checkHashBeforeLoad = Boolean(checkHashBeforeLoad)
		this.checkHashAfterDownload = checkHashAfterDownload === void 0
			? true
			: checkHashAfterDownload

		const query = `type=${os.type()}`
		const uri = `${updateServerUrl}/${bundleId}`

		this.connect = connect(uri, query)

		this.connect.then((connection) => {
			this.register()

			connection.on(EventTypes.Server.NewUpdate, this.downloadUpdate.bind(this))
		})
	}

	public async loadLatestUpdate(): Promise<any> {
		try {
			if (await exists(this.updateDirPath)) {
				return null
			}

			const files = await readdir(this.updateDirPath)

			const updates = files.filter((filename) => filename.endsWith('.asar')).sort()

			if (!updates.length) {
				return null
			}

			const [latestUpdateFilename] = updates.splice(updates.length - 1, 1)
			const latestUpdatePath = path.join(this.updateDirPath, latestUpdateFilename)

			const updateInfo = this.downloadsStore.get(latestUpdateFilename)

			if (!updateInfo || semver.gt(this.versionName, updateInfo.versionName)) {
				return null
			}

			if (this.checkHashBeforeLoad) {
				if (updateInfo.hash) {
					const fileHash = await hashFile(latestUpdatePath)

					if (updateInfo.hash !== fileHash) {
						this.emit(EventTypes.UpdateService.Error, 'Hashes do not match')
						return null
					}
				}
			}

			const updateModule = require(latestUpdatePath)

			// this.downloadsStore.clear()

			for (const filename of updates) {
				unlink(path.join(this.updateDirPath, filename))
			}

			this.emitToServer(EventTypes.Server.Using, {
				versionId: updateInfo.versionId,
				clientId: this.clientId,
			})

			return updateModule
		} catch (error) {
			this.emit(EventTypes.UpdateService.Error, error)

			return null
		}
	}

	public loadLatestUpdateSync(): any {
		try {
			if (!fs.existsSync(this.updateDirPath)) {
				return null
			}

			const files = fs.readdirSync(this.updateDirPath)

			const updates = files.filter((filename) => filename.endsWith('.asar')).sort()

			if (!updates.length) {
				return null
			}

			const [latestUpdateFilename] = updates.splice(updates.length - 1, 1)
			const latestUpdatePath = path.join(this.updateDirPath, latestUpdateFilename)

			const updateInfo = this.downloadsStore.get(latestUpdateFilename)

			if (!updateInfo || semver.gt(this.versionName, updateInfo.versionName)) {
				return null
			}

			if (this.checkHashBeforeLoad) {
				if (!updateInfo.hash) {
					this.emit(EventTypes.UpdateService.Error, 'Hashes do not match')
					return null
				}

				const fileHash = hashFileSync(latestUpdatePath)

				if (updateInfo.hash !== fileHash) {
					this.emit(EventTypes.UpdateService.Error, 'Hashes do not match')
					return null
				}
			}

			const updateModule = require(latestUpdatePath)

			// this.downloadsStore.clear()

			for (const filename of updates) {
				unlink(path.join(this.updateDirPath, filename))
			}

			this.emitToServer(EventTypes.Server.Using, {
				versionId: updateInfo.versionId,
				clientId: this.clientId,
			})

			return updateModule
		} catch (error) {
			this.emit(EventTypes.UpdateService.Error, error)

			return null
		}
	}

	public async checkForUpdate(): Promise<boolean> {
		const { versionName, bundleId } = this

		const { isUpToDate, update } = await this.emitToServer(
			EventTypes.Server.CheckForUpdate,
			{
				versionName,
				bundleId,
				systemType: os.type(),
			},
		) as IUpdateResponse

		if (!isUpToDate) {
			this.downloadUpdate(update)
		}

		return isUpToDate
	}

	private async register() {
		if (!this.sessionStore.has('clientId')) {
			const { clientId } = await this.emitToServer(EventTypes.Server.Register, {
				systemType: os.type(),
				username: os.userInfo().username,
				osRelease: os.release(),
			}) as IRegistrationResponse

			this.clientId = clientId
			this.sessionStore.set('clientId', clientId)
		}
	}

	private async downloadUpdate(args: INewUpdate) {
		const { downloadUrl, ...update } = args

		if (semver.gt(this.versionName, update.versionName)) {
			return
		}

		const report = {
			clientId: this.clientId,
			versionId: update.versionId,
		}

		this.emitToServer(EventTypes.Server.Downloading, report)

		const filename = `${Date.now()}.asar`
		const filePath = path.join(this.updateDirPath, filename)

		try {
			process.noAsar = true

			await download(downloadUrl, this.updateDirPath, { filename })

			this.emitToServer(EventTypes.Server.Downloaded, report)

			if (this.checkHashAfterDownload) {
				const hash = await hashFile(filePath)

				if (update.hash !== hash) {
					throw new Error('Invalid hash')
				}
			}

			const updateInfo = {
				fileName: filename,
				filePath,
				...update,
			}

			this.downloadsStore.set(filename, updateInfo)

			this.emit(EventTypes.UpdateService.Update, updateInfo)
		} catch (error) {
			this.emit(EventTypes.UpdateService.Error, error)

			setTimeout(
				this.downloadUpdate.bind(this, args),
				ElectronUpdateServiceClient.RETRY_TIMEOUT,
			)
		} finally {
			process.noAsar = false
		}
	}

	private emitToServer(eventType: EventTypes.Server, data?: object): Promise<object> {
		return new Promise((resolve, reject) => {
			this.connect.then((connection) => {
				const timeout = setTimeout(
					() => reject(eventType + ' timeout'),
					ElectronUpdateServiceClient.EMIT_TIMEOUT,
				)

				connection.emit(eventType, data, (response: object) => {
					clearTimeout(timeout)
					resolve(response)
				})
			})
		})
	}
}

export default ElectronUpdateServiceClient
