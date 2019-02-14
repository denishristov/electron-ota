// tslint:disable:max-classes-per-file
import { Required, Allow } from 'tsdv-joi/constraints/any'
import { StringSchema, Token, Uri } from 'tsdv-joi/constraints/string'
import { BooleanSchema } from 'tsdv-joi/constraints/boolean'
import { Nested } from 'tsdv-joi'
import { SystemType } from '../enums/SystemType'
import { Or } from 'tsdv-joi/constraints/object'
import { AuthenticatedRequest } from './generic'

class Update {
	@Required()
	@StringSchema()
	public versionName: string

	@Required()
	@BooleanSchema()
	public isCritical: boolean

	@Required()
	@BooleanSchema()
	public isBase: boolean

	@StringSchema()
	public hash: string

	@StringSchema()
	public description?: string

	@Uri()
	public downloadUrl: string
}

export class CheckForUpdateRequest {
	@Required()
	@StringSchema()
	public versionName: string

	@Required()
	@StringSchema()
	public bundleId: string

	@Required()
	// @Or(SystemType)
	public systemType: SystemType
}

export class CheckForUpdateResponse {
	@Required()
	@BooleanSchema()
	public isUpToDate: boolean

	@Nested()
	public update?: Update
}

export class NewUpdateMessage {
	@Required()
	@Nested()
	public update: Update
}

export class PublishVersionRequest extends AuthenticatedRequest {
	@Required()
	@Token()
	public versionId: string
}

export class PublishVersionResponse {
	@Required()
	@BooleanSchema()
	public isSuccessful: boolean

	@Required()
	@Token()
	public versionId: string
}
