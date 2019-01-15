import { IRequest, IResponse } from "./Generic"
import { SystemType } from "../enums/SystemType"

export interface ICheckForUpdateRequest extends IRequest {
	versionName: string
	bundleId: string
	clientId: string
	systemType: SystemType
}

export interface ICheckForUpdateResponse extends IResponse {
	isUpToDate: boolean
	update?: IUpdate
}

export interface INewUpdateMessage {
	update: IUpdate
}

interface IUpdate {
	versionName: string
	isCritical: boolean
	isBase: boolean
	hash: string
	description?: string
	downloadUrl: string
}

export interface IRelease {
	versionId: string
	clientCount?: number
	clients?: string[]
	timeout?: number
	systems: {
		[key in SystemType]: boolean
	}
}

export interface IPublishVersionRequest extends IRequest, IRelease {}

export interface IPublishVersionResponse extends IResponse {
	isSuccessful: boolean
	release?: IRelease
}