import { IRequest, IResponse } from './Generic'

export interface IGetVersionSimpleReportsRequest extends IRequest {
	appId: string
}

export interface IVersionReportModel {
	downloadingCount: number
	downloadedCount: number
	usingCount: number
	errorsCount: number
	version: string
}

export interface IGetVersionSimpleReportsResponse extends IResponse {
	reports: IVersionReportModel[]
}
