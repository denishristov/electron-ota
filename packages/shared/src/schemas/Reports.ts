// tslint:disable:max-classes-per-file
import { ClientModel } from './Client'
import { NumberSchema } from 'tsdv-joi/constraints/number'
import { Required } from 'tsdv-joi/constraints/any'
import { Token, StringSchema } from 'tsdv-joi/constraints/string'
import { NestedArray, Nested } from 'tsdv-joi'
import { AuthenticatedRequest } from './generic'
import { ISystemTypeCount } from '../interfaces/AppClientCount'
import { IGroupedReportsModel } from '../interfaces/GroupedReports'

export class SimpleVersionReportModel {
	@Required()
	@NumberSchema()
	public downloadingCount: number

	@Required()
	@NumberSchema()
	public downloadedCount: number

	@Required()
	@NumberSchema()
	public usingCount: number

	@Required()
	@NumberSchema()
	public errorsCount: number

	@Required()
	@Token()
	public version: string
}

export class GetSimpleVersionReportsRequest extends AuthenticatedRequest {
	@Required()
	@Token()
	public appId: string
}

export class GetSimpleVersionReportsResponse {
	@Required()
	@NestedArray(SimpleVersionReportModel)
	public reports: SimpleVersionReportModel[]
}

export class ReportModel {
	@Required()
	@Nested()
	public client: ClientModel

	@Required()
	@StringSchema()
	public errorMessage?: string

	public timestamp: string
}

export class ReportModelResponse {
	public errorMessage?: string

	public client: ClientModel

	public appId: string

	public versionId: string

	public timestamp: string
}

export class VersionReportModel {
	@Required()
	@NestedArray(ClientModel)
	public downloading: ReportModel[]

	@Required()
	@NestedArray(ClientModel)
	public downloaded: ReportModel[]

	@Required()
	@NestedArray(ClientModel)
	public using: ReportModel[]

	@Required()
	@NestedArray(ReportModel)
	public errorMessages: ReportModel[]

	@Required()
	@Token()
	public version: string
}

export class GetVersionReportsRequest extends AuthenticatedRequest {
	@Required()
	@Token()
	public versionId: string
}

export class GetVersionReportsResponse extends VersionReportModel {}

export class GetAppUsingReportsRequest extends AuthenticatedRequest {
	@Required()
	@StringSchema()
	public appId: string
}

export class GetAppUsingReportsResponse {
	public reports: { [version: string]: ISystemTypeCount }
}

export class GetVersionGroupedReportsRequest extends AuthenticatedRequest {
	@Required()
	@StringSchema()
	public versionId: string
}

export class GetVersionGroupedReportsResponse {
	public reports: IGroupedReportsModel
}
