// tslint:disable:max-classes-per-file
import { Required } from 'tsdv-joi/constraints/any'
import { StringSchema, Token, Uri } from 'tsdv-joi/constraints/string'
import { BooleanSchema } from 'tsdv-joi/constraints/boolean'
import { Nested } from 'tsdv-joi'
import { SystemType } from '../enums/SystemType'
import { Or } from 'tsdv-joi/constraints/object'

export class CheckForUpdateRequest {
	@StringSchema()
	@Required()
	public versionName: string

	@StringSchema()
	@Required()
	public bundleId: string

	@Required()
	@Or('Darwin', 'Linux', 'Windows_RT')
	public systemType: SystemType
}

export class CheckForUpdateResponse {
	@BooleanSchema()
	@Required()
	public isUpToDate: boolean

	@Nested()
	@Required()
	public update?: Update
}

export class NewUpdateMessage {
	@Nested()
	@Required()
	public update: Update
}

class Update {
	@StringSchema()
	@Required()
	public versionName: string

	@BooleanSchema()
	@Required()
	public isCritical: boolean

	@BooleanSchema()
	@Required()
	public isBase: boolean

	@Token()
	public hash: string

	@StringSchema()
	public description?: string

	@Uri()
	public downloadUrl: string
}

export class PublishVersionRequest {
	@Token()
	@Required()
	public versionId: string
}

export class PublishVersionResponse {
	public isSuccessful: boolean

	@Token()
	@Required()
	public versionId: string
}
