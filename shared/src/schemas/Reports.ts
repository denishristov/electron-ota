// tslint:disable:max-classes-per-file
import { ClientModel } from './Client'
import { NumberSchema } from 'tsdv-joi/constraints/number'
import { Required } from 'tsdv-joi/constraints/any'
import { Token, StringSchema } from 'tsdv-joi/constraints/string'
import { NestedArray, Nested } from 'tsdv-joi'
import { AuthenticatedRequest } from './generic'

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

export class Report {
	@Required()
	@Nested()
	public client: ClientModel

	@Required()
	@StringSchema()
	public errorMessage?: string
}

export class VersionReportModel {
	@Required()
	@NestedArray(ClientModel)
	public downloading: Report[]

	@Required()
	@NestedArray(ClientModel)
	public downloaded: Report[]

	@Required()
	@NestedArray(ClientModel)
	public using: Report[]

	@Required()
	@NestedArray(Report)
	public errorMessages: Report[]

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
