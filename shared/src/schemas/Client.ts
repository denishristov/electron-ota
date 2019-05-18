// tslint:disable:max-classes-per-file
import { Required } from 'tsdv-joi/constraints/any'
import { Token, StringSchema } from 'tsdv-joi/constraints/string'
import { Nested } from 'tsdv-joi'
import { Or } from 'tsdv-joi/constraints/object'
import { SystemType } from '../enums/SystemType'

export class ClientModel {
	@Required()
	@Token()
	public id: string

	@Required()
	// @Or(SystemType)
	public systemType: SystemType

	@Required()
	@StringSchema()
	public username: string

	@Required()
	@StringSchema()
	public osRelease: string
}

export class RegisterClientRequest {
	@Required()
	// @Or(SystemType)
	public systemType: string

	@Required()
	@StringSchema()
	public username: string

	@Required()
	@StringSchema()
	public osRelease: string
}

export class RegisterClientResponse {
	@Required()
	@Token()
	public id: string
}

export class ClientReportRequest {
	@Required()
	@Token()
	public id: string

	@Required()
	@Token()
	public versionId: string

	@Required()
	@StringSchema()
	public timestamp: string
}

export class ErrorReportRequest extends ClientReportRequest {
	@Required()
	@StringSchema()
	public errorMessage: string
}

export class ClientReportResponse {
	@Required()
	@Nested()
	public client: ClientModel

	@Required()
	@Token()
	public versionId: string

	@Required()
	@Token()
	public appId: string
}

export class ErrorReportResponse extends ClientReportResponse {
	@Required()
	@StringSchema()
	public errorMessage: string
}
