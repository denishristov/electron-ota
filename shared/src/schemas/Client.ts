// tslint:disable:max-classes-per-file
import { Required } from 'tsdv-joi/constraints/any'
import { Token, StringSchema } from 'tsdv-joi/constraints/string'
import { Or } from 'tsdv-joi/constraints/object'
import { Nested } from 'tsdv-joi'

export class ClientModel {
	@Required()
	@Token()
	public id: string

	@Required()
	@Or('Darwin', 'Linux', 'Windows_RT')
	public systemType: string

	@Required()
	@StringSchema()
	public username: string

	@Required()
	@StringSchema()
	public osRelease: string
}

export class RegisterClientRequest {
	@Required()
	@Or('Darwin', 'Linux', 'Windows_RT')
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
}

export class ErrorReportRequest extends ClientReportRequest {
	@StringSchema()
	@Required()
	public errorMessage: string
}

export class ClientReportResponse {
	@Nested()
	@Required()
	public client: ClientModel

	@Required()
	@Token()
	public versionId: string

	@Required()
	@Token()
	public appId: string
}

export class ErrorReportResponse extends ClientReportResponse {
	@StringSchema()
	@Required()
	public errorMessage: string
}
