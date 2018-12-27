import { IRequest, IResponse } from "./Generic"

export interface IVersionModel {
	id: string
	versionName: string
	downloadUrl: string
	isCritical: boolean
	isBase: boolean
	isPublished: boolean
	appId: string
	description?: string
	hash: string
}

export interface IVersionEditModel {
	id: string
	versionName?: string
	description?: string
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

export interface IGetVersionRequest {
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
	isPublished: boolean
	hash: string
	description?: string
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

export interface IPublishVersionRequest extends IRequest {
	appId: string
	id: string
}

export interface IPublishVersionResponse extends IResponse {
	isSuccessful: boolean
}
