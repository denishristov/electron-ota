import { IRequest, IResponse } from "./Generic";

export interface ICreateAppRequest extends IRequest {
	name: string
	pictureUrl: string
	bundleId: string
}

export interface ICreateAppResponse extends IResponse {
	id: string
	name: string
	pictureUrl: string
	bundleId: string
}

export interface IUpdateAppRequest extends IRequest {
	id: string
	name?: string
	pictureUrl?: string
	bundleId?: string
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