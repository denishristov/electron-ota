import { EventEmitter } from "events"
import { Server } from './enums'

export interface IApiConfig {
	bundleId: string
	updateServerUrl: string
	versionName?: string
	emitTimeout?: number
}

export interface IUpdateServiceOptions extends IApiConfig {
	userDataPath?: string
	checkHashAfterDownload?: boolean
	checkHashBeforeLoad?: boolean
	retryTimeout?: number
	checkForUpdateOnConnect?: boolean
	mainPath?: string
}

export interface IUpdateResponse extends INewUpdate {
	isUpToDate: boolean
	update?: INewUpdate
}

interface IUpdate {
	versionId: string
	versionName: string
	isCritical: boolean
	isBase: boolean
	hash: string
	description?: string
}

export interface INewUpdate extends IUpdate {
	downloadUrl: string
	versionId: string
}

export interface IUpdateInfo extends IUpdate {
	fileName: string
	filePath: string
}

export interface IRegistrationResponse {
	id: string
}

export interface IUpdateService extends EventEmitter {
	checkForUpdate(): Promise<IUpdateResponse>
	loadLatestUpdate<T = any>(): Promise<T>
	loadLatestUpdateSync<T = any>(): T
}

export interface IApi {
	on<T = {}>(eventType: Server, callback: (data: T) => void): this
	dispose(): void
	register(): Promise<IRegistrationResponse>
	checkForUpdate(): Promise<IUpdateResponse>
	reportDownloading(clientId: string, versionId: string): Promise<{}>
	reportDownloaded(clientId: string, versionId: string): Promise<{}>
	reportUsing(clientId: string, versionId: string): Promise<{}>
	reportError(clientId: string, versionId: string, error: string): Promise<{}>
}

export interface ISession {
	id: string
}

declare global {
	namespace NodeJS {
		// tslint:disable-next-line:interface-name
		interface Process {
			noAsar?: boolean
		}
	}
}
