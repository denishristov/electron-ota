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
	download,
	exists,
	mkdir,
	readFile
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

	constructor({ versionName, userDataPath, bundleId, updateServerUrl }: IUpdateServiceOptions) {
		super()

		this.updateDirPath = path.join(userDataPath, 'updates')

		this.connection = io(`${updateServerUrl}/${bundleId}`, {
			query: `type=${os.platform()}&versionName=${versionName}`
		})

		this.connection.on(EventTypes.Server.Connect, () => {
			this.connection.emit(
				EventTypes.Server.CheckForUpdate, 
				{ versionName }, 
				({ isUpToDate, ...update }: IUpdateResponse) => {
					!isUpToDate && this.downloadUpdate(update)
				}
			)
		})

		this.connection.on(EventTypes.Server.NewUpdate, this.downloadUpdate.bind(this))
	}

	private async downloadUpdate(args: INewUpdate) {
		const fileName = `${+new Date()}.asar`
		const filePath = path.join(this.updateDirPath, fileName)
		const { downloadUrl, ...info } = args
		
		try {
			process.noAsar = true

			await this.checkIfUpdateDirExists()
			await download(downloadUrl, filePath)

			if (info.hash !== await this.hashFile(filePath)) {
				throw new Error('Invalid hash')
			}

			const updateInfo = {
				fileName, 
				filePath,
				...info
			}
			
			this.emit(EventTypes.UpdateService.Update, updateInfo, () => {
				this.connection.emit(EventTypes.Server.SuccessfulUpdate)
			})
		} catch (error) {
			this.emit(EventTypes.UpdateService.Error, error)

			setTimeout(
				this.downloadUpdate.bind(this, args), 
				UpdateService.RETRY_TIMEOUT,
			)
		} finally {
			process.noAsar = false
		}
	}

	private async hashFile(path: string): Promise<string> {
		const file = await readFile(path)
		const hash = crypto.createHash('sha256').update(file)
				
		await Promise.resolve()
		return hash.digest('base64')
	}

	private async checkIfUpdateDirExists(): Promise<void> {
		if (!await exists(this.updateDirPath)) {
			await mkdir(this.updateDirPath)
		}
	}
}

export default UpdateService