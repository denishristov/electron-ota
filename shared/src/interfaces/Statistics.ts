import { IRequest, IResponse } from './Generic'
import { IClientModel } from './Client'

export interface IGetVersionSimpleReportsRequest extends IRequest {
	appId: string
}

export interface IVersionSimpleReportModel {
	downloadingCount: number
	downloadedCount: number
	usingCount: number
	errorsCount: number
	version: string
}

// export interface IVersionReportModel {
// 	downloadingCount: IClientModel[]
// 	downloadedCount: IClientModel[]
// 	usingCount: IClientModel[]
// 	errorsCount: IClientModel[]
// 	version: string
// }

export interface IGetVersionSimpleReportsResponse extends IResponse {
	reports: IVersionSimpleReportModel[]
}
