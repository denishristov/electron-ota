// tslint:disable:max-classes-per-file
import { ClientModel } from './Client'
import { NumberSchema } from 'tsdv-joi/constraints/number'
import { Required } from 'tsdv-joi/constraints/any'
import { Token, StringSchema } from 'tsdv-joi/constraints/string'
import { NestedArray, Nested } from 'tsdv-joi'

export class SimpleVersionReportModel {
	@NumberSchema()
	@Required()
	public downloadingCount: number

	@NumberSchema()
	@Required()
	public downloadedCount: number

	@NumberSchema()
	@Required()
	public usingCount: number

	@NumberSchema()
	@Required()
	public errorsCount: number

	@Token()
	@Required()
	public version: string
}

export class GetSimpleVersionReportsRequest {
	@Token()
	@Required()
	public appId: string
}

export class GetSimpleVersionReportsResponse {
	@Required()
	@NestedArray(SimpleVersionReportModel)
	public reports: SimpleVersionReportModel[]
}

export class ErrorReport {
	@Nested()
	@Required()
	public client: ClientModel

	@StringSchema()
	@Required()
	public errorMessage: string
}

export class VersionReportModel {
	@Required()
	@NestedArray(ClientModel)
	public downloading: ClientModel[]

	@Required()
	@NestedArray(ClientModel)
	public downloaded: ClientModel[]

	@Required()
	@NestedArray(ClientModel)
	public using: ClientModel[]

	@Required()
	@NestedArray(ErrorReport)
	public errorMessages: ErrorReport[]
}

export class GetVersionReportsRequest {
	@Nested()
	@Required()
	public versionId: string
}

export class GetVersionReportsResponse extends VersionReportModel {}
