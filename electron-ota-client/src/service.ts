import path from 'path'
import fs from 'fs'
import { EventEmitter } from 'events'

import download from 'download'
import semver from 'semver'
import Store from 'electron-store'

import { Server, UpdateService } from './enums'
import Api from './api'

import {
	INewUpdate,
	IUpdateResponse,
	IUpdateInfo,
	IUpdateServiceOptions,
	IUpdateService,
	ISession,
	IApi,
} from './interfaces'

import {
	hashFile,
	readdir,
	unlink,
	hashFileSync,
	exists,
	normalizeOptions,
} from './functions'

class ElectronClientUpdateService extends EventEmitter implements IUpdateService {
	private readonly updateDirPath: string

	private readonly downloadsStore = new Store<IUpdateInfo>({ name: 'updater' })

	private readonly sessionStore = new Store<ISession>({ name: 'session' })

	private readonly options: IUpdateServiceOptions

	private readonly api: IApi

	private isDownloading = false

	constructor(options: IUpdateServiceOptions) {
		super()

		this.options = normalizeOptions(options)

		this.updateDirPath = path.join(this.options.userDataPath, 'updates')

		if (!this.options.versionName) {
			throw new Error('Version name was not provided and is missing from package.json.')
		}

		if (!this.options.updateServerUrl) {
			throw new Error('Server url name was not provided.')
		}

		this.api = new Api(this.options)
			.on(Server.NewUpdate, this.downloadUpdate.bind(this))
			.on(Server.Error, (error: Error) => {
				this.emit(UpdateService.Error, error)
			})

		if (this.options.checkForUpdateOnConnect) {
			this.api.on(Server.Connect, this.checkForUpdate.bind(this))
		}

		if (!this.clientId) {
			this.api.register().then(({ id }) => {
				this.clientId = id
			})
		}
	}

	public async loadLatestUpdate<T = any>(): Promise<T> {
		let updateInfo: IUpdateInfo

		try {
			if (await exists(this.updateDirPath)) {
				throw new Error('No updates')
			}

			const files = await readdir(this.updateDirPath)

			const updates = files.filter((filename) => filename.endsWith('.asar')).sort()

			if (!updates.length) {
				throw new Error('No updates')
			}

			const [latestUpdateFilename] = updates.splice(updates.length - 1, 1)
			const latestUpdatePath = path.join(this.updateDirPath, latestUpdateFilename)

			updateInfo = this.downloadsStore.get(latestUpdateFilename.replace('.asar', ''))

			if (!updateInfo || !semver.gt(updateInfo.versionName, this.options.versionName)) {
				throw new Error('No updates')
			}

			if (this.options.checkHashBeforeLoad) {
				if (!updateInfo.hash) {
					throw new Error('Update lacks hash')
				}

				const fileHash = await hashFile(latestUpdatePath)

				if (updateInfo.hash !== fileHash) {
					throw new Error('Hashes do not match')
				}
			}

			const updateModule = require(latestUpdatePath)

			for (const filename of updates) {
				this.downloadsStore.delete(filename.replace('.asar', ''))
				unlink(path.join(this.updateDirPath, filename))
			}

			if (this.clientId && updateInfo.versionId) {
				this.api
					.reportUsing(this.clientId, updateInfo.versionId)
					.then(this.api.dispose.bind(this.api))
			}

			return updateModule
		} catch (error) {
			if (updateInfo && this.clientId && updateInfo.versionId) {
				this.api.reportError(this.clientId, updateInfo.versionId, error.message || error.stack)
			}

			this.emit(UpdateService.Error, error)

			const { mainPath } = this.options

			if (mainPath) {
				require(mainPath)
			}

			return null
		}
	}

	public loadLatestUpdateSync<T = any>(): T {
		let updateInfo: IUpdateInfo

		try {
			if (!fs.existsSync(this.updateDirPath)) {
				throw new Error('No updates')
			}

			const files = fs.readdirSync(this.updateDirPath)

			const updates = files.filter((filename) => filename.endsWith('.asar')).sort()

			if (!updates.length) {
				throw new Error('No updates')
			}

			const [latestUpdateFilename] = updates.splice(updates.length - 1, 1)
			const latestUpdatePath = path.join(this.updateDirPath, latestUpdateFilename)

			updateInfo = this.downloadsStore.get(latestUpdateFilename.replace('.asar', ''))

			if (!updateInfo || !semver.gt(updateInfo.versionName, this.options.versionName)) {
				throw new Error('No updates')
			}

			if (this.options.checkHashBeforeLoad) {
				if (!updateInfo.hash) {
					throw new Error('Update lacks hash')
				}

				const fileHash = hashFileSync(latestUpdatePath)

				if (updateInfo.hash !== fileHash) {
					throw new Error('Hashes do not match')
				}
			}

			const updateModule = require(latestUpdatePath)

			for (const filename of updates) {
				this.downloadsStore.delete(filename.replace('.asar', ''))
				unlink(path.join(this.updateDirPath, filename))
			}

			if (this.clientId && updateInfo.versionId) {
				this.api
					.reportUsing(this.clientId, updateInfo.versionId)
					.then(this.api.dispose.bind(this.api))
			}

			return updateModule
		} catch (error) {
			if (updateInfo && this.clientId && updateInfo.versionId) {
				this.api.reportError(this.clientId, updateInfo.versionId, error.message || error.stack)
			}

			this.emit(UpdateService.Error, error)

			const { mainPath } = this.options

			if (mainPath) {
				require(mainPath)
			}

			return null
		}
	}

	public async checkForUpdate(): Promise<IUpdateResponse> {
		const response = await this.api.checkForUpdate()

		if (!response.isUpToDate) {
			this.downloadUpdate(response.update)
		}

		return response
	}

	private get clientId(): string {
		return this.sessionStore.get('clientId')
	}

	private set clientId(id: string) {
		this.sessionStore.set('clientId', id)
	}

	private async downloadUpdate(args: INewUpdate) {
		if (this.isDownloading) {
			return
		}

		const { downloadUrl, ...update } = args

		const now = Date.now().toString()
		const filename = `${now}.asar`
		const filePath = path.join(this.updateDirPath, filename)

		const updateInfo = {
			fileName: filename,
			filePath,
			...update,
		}

		if (semver.gt(this.options.versionName, update.versionName)) {
			return
		}

		for (const version of Object.values(this.downloadsStore.store)) {
			if (semver.gt((version as IUpdateInfo).versionName, update.versionName)) {
				return
			}
		}

		if (update.isBase) {
			this.emit(UpdateService.Update, updateInfo)
			return
		}

		try {
			if (!downloadUrl) {
				throw new Error('DownloadUrl not present.')
			}

			this.isDownloading = true

			this.api.reportDownloading(this.clientId, update.versionId)

			process.noAsar = true

			await download(downloadUrl, this.updateDirPath, { filename })

			this.api.reportDownloaded(this.clientId, update.versionId)

			if (this.options.checkHashAfterDownload) {
				const hash = await hashFile(filePath)

				if (update.hash !== hash) {
					throw new Error('Invalid hash')
				}
			}

			this.downloadsStore.set(now, updateInfo)

			this.emit(UpdateService.Update, updateInfo)
		} catch (error) {
			this.api.reportError(this.clientId, update.versionId, error.errorMessage || error.stack)
			this.emit(UpdateService.Error, error)

			setTimeout(
				this.downloadUpdate.bind(this, args),
				this.options.retryTimeout,
			)
		} finally {
			process.noAsar = false
			this.isDownloading = false
		}
	}
}
// tslint:disable-next-line:interface-name
declare interface ElectronClientUpdateService {
	on(event: 'update', listener: (info: IUpdateInfo) => void): this
	on(event: 'error', listener: (error: Error) => void): this
}

export default ElectronClientUpdateService
