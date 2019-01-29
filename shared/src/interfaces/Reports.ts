import { IRequest, IResponse } from './Generic'
import { IClientModel } from './Client'

export interface ISimpleVersionReportModel {
	downloadingCount: number
	downloadedCount: number
	usingCount: number
	errorsCount: number
	version: string
}

export interface IGetSimpleVersionReportsRequest extends IRequest {
	appId: string
}

export interface IGetSimpleVersionReportsResponse extends IResponse {
	reports: ISimpleVersionReportModel[]
}

export interface IErrorReport {
	client: IClientModel
	errorMessage: string
}

export interface IVersionReportModel {
	downloading: IClientModel[]
	downloaded: IClientModel[]
	using: IClientModel[]
	errorMessages: IErrorReport[]
}

export interface IGetVersionReportsRequest extends IRequest {
	versionId: string
}

export interface IGetVersionReportsResponse extends IResponse, IVersionReportModel {}
