import { IResponse } from './Generic'

export interface IClientModel {
	id: string
	systemType: string
	username: string
	osRelease: string
	clientId: string
	versionName: string
}

export interface IRegisterClientRequest extends Exclude<IClientModel, 'id'> {}

export interface IRegisterClientResponse {
	clientId: string
}

export interface IClientReportRequest {
	clientId: string
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
