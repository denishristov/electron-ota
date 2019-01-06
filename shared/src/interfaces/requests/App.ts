import { IRequest, IResponse } from "./Generic";
import { IVersionModel } from "./Version";

export interface IAppModel {
	id: string
	name: string
	pictureUrl: string
	bundleId: string
	latestVersion?: IVersionModel
	versions: number
}

export interface IGetAppsRequest extends IRequest {}

export interface IGetAppsResponse extends IResponse {
	apps: IAppModel[]
}

export interface ICreateAppRequest extends IRequest {
	name: string
	pictureUrl: string
	bundleId: string
}

export interface ICreateAppResponse extends IResponse, IAppModel {}

export interface IUpdateAppRequest extends IRequest {
	id: string
	name?: string
	pictureUrl?: string
	bundleId?: string
	latestVersion?: string
}

export interface IUpdateAppResponse extends IResponse {
	id: string
	name?: string
	pictureUrl?: string
	bundleId?: string
}

export interface IDeleteAppRequest extends IRequest {
	id: string
}

export interface IDeleteAppResponse extends IResponse {
	id: string
}