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
	IUpdateServiceOptions
} from './Interfaces'
import {
	checkDir,
	hashFile,
	readdir,
	unlink,
	hashFileSync,
	uuid,
	connect,
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
	private readonly updateDirPath: string
	private readonly versionName: string
	private readonly bundleId: string
	private readonly checkHashAfterDownload: boolean
	private readonly checkHashBeforeLoad: boolean
	private readonly downloadsStore = new Store({ name: 'updater' })
	private readonly sessionStore = new Store({ name: 'session '})
	private readonly connect: Promise<SocketIOClient.Socket>

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

		this.updateDirPath = path.join(userDataPath || app.getPath('userData'), 'updates')
		this.versionName = versionName
		this.bundleId = bundleId
		
		this.checkHashBeforeLoad = Boolean(checkHashBeforeLoad)
		this.checkHashAfterDownload = checkHashAfterDownload === void 0 
			? true 
			: checkHashAfterDownload

		const sessionId = this.sessionId || uuid()
		const query = `type=${os.type()}&sessionId=${sessionId}`
		const uri = `${updateServerUrl}/${bundleId}`

		this.connect = connect(uri, query)

		this.connect.then((connection) => {
			if (!sessionId) {
				this.register(sessionId)
			}
			
			connection.on(EventTypes.Server.NewUpdate, this.downloadUpdate.bind(this))
		})
	}

	public async loadLatestUpdate(): Promise<any> {
		try {
			const files = await readdir(this.updateDirPath)
			
			const updates = files.filter(filename => filename.endsWith('.asar')).sort()
			
			if (!updates.length) {
				return null
			}
			
			const [latestUpdateFilename] = updates.splice(updates.length - 1, 1)
			const latestUpdatePath = path.join(this.updateDirPath, latestUpdateFilename)
			
			if (this.checkHashBeforeLoad) {
				const { hash } = this.downloadsStore.get(latestUpdateFilename)
				
				if (hash) {
					const fileHash = await hashFile(latestUpdatePath)
					
					if (hash !== fileHash) {
						this.emit(EventTypes.UpdateService.Error, 'Hashes do not match')
						return null
					}
				}
			}
			
			this.downloadsStore.clear()
			
			for (const filename of updates) {
				unlink(path.join(this.updateDirPath, filename))	
			}
			
			this.emitToServer(EventTypes.Server.Using, this.session)
			
			return require(latestUpdatePath)
		} catch(error) {
			this.emit(EventTypes.UpdateService.Error, error)

			return null
		}
	}

	public loadLatestUpdateSync(): any {
		try {
			const files = fs.readdirSync(this.updateDirPath)
			
			const updates = files.filter(filename => filename.endsWith('.asar')).sort()
			
			if (!updates.length) {
				return null
			}
			
			const [latestUpdateFilename] = updates.splice(updates.length - 1, 1)
			const latestUpdatePath = path.join(this.updateDirPath, latestUpdateFilename)
			
			if (this.checkHashBeforeLoad) {
				const { hash } = this.downloadsStore.get(latestUpdateFilename)
				
				if (!hash) {
					this.emit(EventTypes.UpdateService.Error, 'Hashes do not match')
					return null
				}
				
				const fileHash = hashFileSync(latestUpdatePath)
				
				if (hash !== fileHash) {
					this.emit(EventTypes.UpdateService.Error, 'Hashes do not match')
					return null
				}
			}
			
			this.downloadsStore.clear()
			
			for (const filename of updates) {
				unlink(path.join(this.updateDirPath, filename))	
			}
			
			this.emitToServer(EventTypes.Server.Using)
			
			return require(latestUpdatePath)
		} catch(error) {
			this.emit(EventTypes.UpdateService.Error, error)

			return null
		}
	}

	private get session() {
		return {
			sessionId: this.sessionId
		}
	}

	private get sessionId() {
		return this.sessionStore.get('sessionId')
	}

	private set sessionId(sessionId: string) {
		this.sessionStore.set('sessionId', sessionId)
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

	private async register(sessionId: string) {
		const session = {
			sessionId,
			systemType: os.type(),
			username: os.userInfo().username,
			osRelease: os.release(),
		}

		this.sessionId = sessionId
		this.emitToServer(EventTypes.Server.Register, session)
	}

	private async downloadUpdate(args: INewUpdate) {
		const { downloadUrl, ...update } = args

		if (semver.gt(this.versionName, update.versionName)) {
			return
		}

		console.log('downloading')

		this.emitToServer(EventTypes.Server.Downloading, this.session)

		const filename = `${Date.now()}.asar`
		const filePath = path.join(this.updateDirPath, filename)

		try {
			process.noAsar = true
			
			// await checkDir(this.updateDirPath)
			console.log('downloaded')
			await download(downloadUrl, this.updateDirPath, { filename })

			this.emitToServer(EventTypes.Server.Downloaded, this.session)

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
			const timeout = setTimeout(
				() => reject(eventType + ' timeout'),
				ElectronUpdateServiceClient.EMIT_TIMEOUT
			)
			console.log('connected')

			this.connect.then(connection => 
				connection.emit(eventType, data, (response: object) => {
					clearTimeout(timeout)
					resolve(response)
				})
			)
		})
	}
}

export default ElectronUpdateServiceClient