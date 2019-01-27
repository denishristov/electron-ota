import { IRequest, IResponse, ITimestampedDocument } from './Generic'
import { SystemType } from '../enums/SystemType'

export interface IVersionModel extends ITimestampedDocument {
	id: string
	versionName: string
	downloadUrl: string
	isCritical: boolean
	isBase: boolean
	appId: string
	description?: string
	hash: string
	createdAt: string
	systems: {
		[key in SystemType]: boolean
	}
}

export interface IVersionEditModel {
	id: string
	versionName?: string
	description?: string
	isCritical?: boolean
	isBase?: boolean
}

export interface IVersionRequest extends IRequest {
	appId: string
}

export interface IVersionResponse extends IResponse {
	appId: string
}

export interface IGetVersionRequest extends IRequest {
	id: string
}

export interface IGetVersionResponse extends IResponse, IVersionModel {}

export interface IGetVersionByNameRequest {
	versionName: string
}

export interface IGetVersionByNameResponse extends IVersionModel, IResponse {}

export interface IGetVersionsRequest extends IVersionRequest {}

export interface IGetVersionsResponse extends IResponse {
	versions: IVersionModel[]
}

export interface ICreateVersionRequest extends IVersionRequest {
	versionName: string
	downloadUrl: string
	isCritical: boolean
	isBase: boolean
	isReleased: boolean
	hash: string
	description?: string
	systems: {
		[key in SystemType]: boolean
	}
}

export interface ICreateVersionResponse extends IVersionResponse, IVersionModel {}

export interface IUpdateVersionRequest extends IVersionRequest, IVersionEditModel {}

export interface IUpdateVersionResponse extends IVersionResponse, IVersionEditModel {}

export interface IDeleteVersionRequest extends IVersionRequest {
	id: string
}

export interface IDeleteVersionResponse extends IVersionResponse {
	id: string
}