import { IResponse } from './Generic'
import { IVersionModel } from './Version'

export interface IClientModel {
	id: string
	systemType: string
	username: string
	osRelease: string
}

export interface IRegisterClientRequest extends Exclude<IClientModel, 'id'> {}

export interface IRegisterClientResponse {
	id: string
}

export interface IClientReportRequest {
	id: string
	versionId: string
}

export interface IErrorReportRequest extends IClientReportRequest {
	errorMessage: string
}

export interface IClientReportResponse extends IResponse {
	client: IClientModel
	versionId: string
	appId: string
}

export interface IErrorReportResponse extends IClientReportResponse {
	errorMessage: string
}
