import fs from 'fs'
import os from 'os'
import path from 'path'
import crypto from 'crypto'
import { EventEmitter } from 'events'

import io from 'socket.io-client'

import * as EventTypes from './EventTypes'
import { 
	INewUpdate, 
	IUpdateResponse, 
	IUpdateInfo,
	IUpdateServiceOptions
} from './Interfaces'
import {
	noop,
	download,
} from './Functions'


declare global {
	namespace NodeJS {
		interface Process {
			noAsar?: boolean
		}
	}
}


declare interface UpdateService {
	on(event: 'update', listener: (info: IUpdateInfo, emitSuccessfulUpdate: () => void) => void): this
	on(event: 'error', listener: (error: Error) => void): this
}

class UpdateService extends EventEmitter {
	private readonly connection: SocketIOClient.Socket

	private readonly updateDirPath: string

	private static readonly RETRY_TIMEOUT = 1000 * 60 

	private readonly id = crypto.randomBytes(16).toString('base64')

	constructor(options: IUpdateServiceOptions) {
		super()

		this.updateDirPath = path.join(options.userDataPath, 'updates')

		this.connection = io(`${options.updateServerUrl}/${options.bundleId}`, {
			query: `type=${os.platform()}&versionName=${options.versionName}`
		})

		this.connection.on(EventTypes.Server.Connect, () => {
			this.connection.emit(EventTypes.Server.CheckForUpdate, {
				versionName: options.versionName
			}, (res: IUpdateResponse) => {
				if (!res.isUpToDate) {
					this.downloadUpdate(res)
				}
			})
		})

		this.connection.on(EventTypes.Server.NewUpdate, this.downloadUpdate.bind(this))

		fs.exists(this.updateDirPath, exists => {
			!exists && fs.mkdir(this.updateDirPath, noop)
		})
	}

	private async downloadUpdate(args: INewUpdate) {
		const fileName = `${+new Date()}.asar`
		const filePath = path.join(this.updateDirPath, fileName)
		const { downloadUrl, ...info } = args

		try {
			process.noAsar = true
			
			await download(downloadUrl, filePath)
		} catch (error) {
			this.emit(EventTypes.UpdateService.Error, error)

			setTimeout(
				this.downloadUpdate.bind(this, args), 
				UpdateService.RETRY_TIMEOUT,
			)

			return
		} finally {
			process.noAsar = false
		}

		const updateInfo = { 
			fileName, 
			filePath,
			...info
		}

		this.emit(EventTypes.UpdateService.Update, updateInfo, () => {
			this.connection.emit(EventTypes.Server.SuccessfulUpdate, {
				id: this.id,
			})
		})
	}
}

export default UpdateService