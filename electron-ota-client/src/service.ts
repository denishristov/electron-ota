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
	IStringMap,
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
	private readonly sessionStore = new Store<ISession>({ name: 'session' })

	private readonly downloadsStore = new Store<IStringMap<IUpdateInfo>>({ name: 'updates' })

	private readonly updateDirPath: string

	private readonly options: IUpdateServiceOptions

	private readonly api: IApi

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
		const { mainPath } = this.options
		let updateInfo: IUpdateInfo

		try {
			if (await exists(this.updateDirPath)) {
				return mainPath ? require(mainPath) : null
			}

			const files = await readdir(this.updateDirPath)
			const updates = files.filter((filename) => filename.endsWith('.asar')).sort()

			if (!updates.length) {
				return mainPath ? require(mainPath) : null
			}

			const [latestUpdateFilename] = updates.splice(updates.length - 1, 1)
			const latestUpdatePath = path.join(this.updateDirPath, latestUpdateFilename)

			updateInfo = this.downloadsStore.get(latestUpdateFilename.replace('.asar', ''))

			if (!updateInfo || !semver.gt(updateInfo.versionName, this.options.versionName)) {
				return mainPath ? require(mainPath) : null
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
			this.error(error, updateInfo && updateInfo.versionId)

			return mainPath ? require(mainPath) : null
		}
	}

	public loadLatestUpdateSync<T = any>(): T {
		const { mainPath } = this.options
		let updateInfo: IUpdateInfo

		try {
			if (!fs.existsSync(this.updateDirPath)) {
				return mainPath ? require(mainPath) : null
			}

			const files = fs.readdirSync(this.updateDirPath)
			const updates = files.filter((filename) => filename.endsWith('.asar')).sort()

			if (!updates.length) {
				return mainPath ? require(mainPath) : null
			}

			const [latestUpdateFilename] = updates.splice(updates.length - 1, 1)
			const latestUpdatePath = path.join(this.updateDirPath, latestUpdateFilename)

			updateInfo = this.downloadsStore.get(latestUpdateFilename.replace('.asar', ''))

			if (!updateInfo || !semver.gt(updateInfo.versionName, this.options.versionName)) {
				return mainPath ? require(mainPath) : null
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
			this.error(error, updateInfo && updateInfo.versionId)

			return mainPath ? require(mainPath) : null
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

	private error(error: Error, versionId?: string) {
		if (this.clientId && versionId) {
			this.api.reportError(this.clientId, versionId, `${error.message}${'\n' + error.stack}`)
		}

		setTimeout(() => this.emit(UpdateService.Error, error))
	}

	private async downloadUpdate(args: INewUpdate) {
		const { downloadUrl, ...update } = args

		const now = Date.now().toString()
		const filename = `${now}.asar`
		const filePath = path.join(this.updateDirPath, filename)

		const updateInfo = {
			fileName: filename,
			filePath,
			...update,
		}

		if (semver.gte(this.options.versionName, update.versionName)) {
			return
		}

		const downloadedVersions: IUpdateInfo[] = Object.values(this.downloadsStore.store)

		for (const version of downloadedVersions) {
			if (semver.gte(version.versionName, update.versionName)) {
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
			this.error(error, updateInfo.versionId)

			setTimeout(
				this.downloadUpdate.bind(this, args),
				this.options.retryTimeout,
			)
		} finally {
			process.noAsar = false
		}
	}
}
// tslint:disable-next-line:interface-name
declare interface ElectronClientUpdateService {
	on(event: 'update', listener: (info: IUpdateInfo) => void): this
	on(event: 'error', listener: (error: Error) => void): this
}

export default ElectronClientUpdateService
