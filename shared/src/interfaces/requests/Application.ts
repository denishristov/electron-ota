import { IRequest, IResponse } from "./Generic";

export interface ICreateApplicationRequest extends IRequest {
	name: string
	iconUploadId: string
	isCritical: boolean
}

export interface ICreateApplicationResponse extends IResponse {
	name: string
	iconUploadId: string
	isCritical: boolean
}

export interface IUpdateApplicationRequest extends IRequest {
	id: string
	name?: string
	iconUploadId?: string
}

export interface IUpdateApplicationResponse extends IResponse {
	id: string
	name?: string
	iconUploadId?: string
}

export interface IDeleteApplicationRequest extends IRequest {
	id: string
}

export interface IDeleteApplicationResponse extends IResponse {
	id: string
}