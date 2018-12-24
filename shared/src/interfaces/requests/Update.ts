import { IRequest, IResponse } from "./Generic"

export interface ICheckForUpdateRequest {
	versionName: string
}

export interface ICheckForUpdateResponse extends IResponse {
	isUpToDate: boolean
	downloadUrl?: string
	isCritical?: boolean
	isBase?: boolean
	description?: string
}

export interface INewUpdateMessage {
	downloadUrl: string
	isCritical: boolean
	isBase: boolean
	description?: string
}

export interface INewUpdateResponse {
	isDownloading: boolean
}
