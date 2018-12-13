import { IRequest, IResponse } from "./Generic"

export interface IVersionModel {
	id: string
	versionName: string
	downloadUrl: string
	isCritical: boolean
	isBase: boolean
	isPublished: boolean
	appId: string
}

export interface IVersionEditModel {
	id: string
	versionName?: string
	downloadUrl?: string
	isCritical?: boolean
	isBase?: boolean
	isPublished?: boolean
}

export interface IVersionRequest extends IRequest {
	appId: string
}

export interface IVersionResponse extends IResponse {
	appId: string
}

export interface IGetVersionsRequest extends IVersionRequest {}

export interface IGetVersionsResponse extends IVersionResponse {
	versions: IVersionModel[]
}

export interface ICreateVersionRequest extends IVersionRequest {
	versionName: string
	downloadUrl: string
	isCritical: boolean
	isBase: boolean
	isPublished: boolean
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