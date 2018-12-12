import { IRequest, IResponse } from "./Generic";

export interface ICreateAppRequest extends IRequest {
	name: string
	iconUploadId: string
	isCritical: boolean
}

export interface ICreateAppResponse extends IResponse {
	id: string
	name: string
	iconUploadId: string
	isCritical: boolean
}

export interface IUpdateAppRequest extends IRequest {
	id: string
	name?: string
	iconUploadId?: string
}

export interface IUpdateAppResponse extends IResponse {
	id: string
	name?: string
	iconUploadId?: string
}

export interface IDeleteAppRequest extends IRequest {
	id: string
}

export interface IDeleteAppResponse extends IResponse {
	id: string
}