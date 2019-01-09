import os from 'os'
import path from 'path'
import fs from 'fs'
import { EventEmitter } from 'events'

import io from 'socket.io-client'
import download from 'download'
import semver from 'semver'
import Store from 'electron-store'
import { app } from 'electron'

import * as EventTypes from './EventTypes'
import {
	INewUpdate,
	IUpdateResponse,
	IUpdateInfo,
	IUpdateServiceOptions
} from './Interfaces'
import {
	checkDir,
	hashFile,
	readdir,
	unlink,
	hashFileSync,
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
	private readonly uri: string
	private readonly updateDirPath: string
	private readonly versionName: string
	private readonly checkHashAfterDownload: boolean
	private readonly checkHashBeforeLoad: boolean
	private readonly store = new Store({ name: 'updater' })
	private readonly connect: Promise<SocketIOClient.Socket> = this.connectPromise

	private static readonly RETRY_TIMEOUT = 1000 * 60
	private static readonly EMIT_TIMEOUT = 1000 * 60

	constructor({
		versionName,
		userDataPath,
		bundleId,
		updateServerUrl,
		checkHashAfterDownload,
		checkHashBeforeLoad,
	}: IUpdateServiceOptions) {
		super()

		this.uri = `${updateServerUrl}/${bundleId}`
		this.updateDirPath = path.join(userDataPath || app.getPath('userData'), 'updates')
		this.versionName = versionName
		this.checkHashBeforeLoad = Boolean(checkHashBeforeLoad)
		this.checkHashAfterDownload = checkHashAfterDownload === void 0 
			? true 
			: checkHashAfterDownload
	}

	public async loadLatestUpdate(): Promise<any> {
		const files = await readdir(this.updateDirPath)
		const updates = files.filter(filename => filename.endsWith('.asar')).sort()

		if (!updates.length) {
			return null
		}

		const [latestUpdateFilename] = updates.splice(updates.length - 1, 1)
		const latestUpdatePath = path.join(this.updateDirPath, latestUpdateFilename)

		if (this.checkHashBeforeLoad) {
			const { hash } = this.store.get(latestUpdateFilename)

			if (hash) {
				const fileHash = await hashFile(latestUpdatePath)
				
				if (hash !== fileHash) {
					this.emit(EventTypes.UpdateService.Error, 'Hashes do not match')
					return null
				}
			}
		}

		this.store.clear()

		for (const filename of updates) {
			unlink(path.join(this.updateDirPath, filename))	
		}
		
		this.emitToServer(EventTypes.Server.SuccessfulUpdate)

		return require(latestUpdatePath)
	}

	public loadLatestUpdateSync(): any {
		const files = fs.readdirSync(this.updateDirPath)
		const updates = files.filter(filename => filename.endsWith('.asar')).sort()

		if (!updates.length) {
			return null
		}

		const [latestUpdateFilename] = updates.splice(updates.length - 1, 1)
		const latestUpdatePath = path.join(this.updateDirPath, latestUpdateFilename)

		if (this.checkHashBeforeLoad) {
			const { hash } = this.store.get(latestUpdateFilename)

			if (hash) {
				const fileHash = hashFileSync(latestUpdatePath)
				
				if (hash !== fileHash) {
					this.emit(EventTypes.UpdateService.Error, 'Hashes do not match')
					return null
				}
			}
		}

		this.store.clear()

		for (const filename of updates) {
			unlink(path.join(this.updateDirPath, filename))	
		}
		
		this.emitToServer(EventTypes.Server.SuccessfulUpdate)

		return require(latestUpdatePath)
	}

	public async checkForUpdate(): Promise<boolean> {
		const { versionName } = this

		const { isUpToDate, ...update } = await this.emitToServer(
			EventTypes.Server.CheckForUpdate,
			{ versionName },
		) as IUpdateResponse

		if (!isUpToDate) {
			this.downloadUpdate(update)
		}

		return isUpToDate
	}

	private get connectPromise() {
		return Promise.resolve().then(() => {
			const query = `type=${os.platform()}&versionName=${this.versionName}`
	
			const connection = io(this.uri, { query })
	
			connection.on(EventTypes.Server.Connect, this.checkForUpdate.bind(this))
			connection.on(EventTypes.Server.NewUpdate, this.downloadUpdate.bind(this))
	
			return connection
		})
	}

	private async downloadUpdate(args: INewUpdate) {
		const { downloadUrl, ...update } = args

		if (semver.gt(this.versionName, update.versionName)) {
			return
		}

		const filename = `${Date.now()}.asar`
		const filePath = path.join(this.updateDirPath, filename)

		try {
			process.noAsar = true
			// await checkDir(this.updateDirPath)
			await download(downloadUrl, this.updateDirPath, { filename })

			if (this.checkHashAfterDownload) {	
				const hash = await hashFile(filePath)
				
				if (update.hash !== hash) {
					throw new Error('Invalid hash')
				}
			}

			const updateInfo = {
				fileName: filename,
				filePath,
				...update
			}

			this.store.set(filename, updateInfo)

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
			const timeout = setTimeout(
				() => reject(eventType + ' timeout'),
				ElectronUpdateServiceClient.EMIT_TIMEOUT
			)

			this.connect.then(connection => connection.emit(eventType, data, (response: object) => {
					clearTimeout(timeout)
					resolve(response)
				})
			)
		})
	}
}

export default ElectronUpdateServiceClient