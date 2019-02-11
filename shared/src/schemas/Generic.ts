// tslint:disable:max-classes-per-file
import { Required } from 'tsdv-joi/constraints/any'
import { DateSchema } from 'tsdv-joi/constraints/date'
import { StringSchema } from 'tsdv-joi/constraints/string'

export class TimestampedDocument {
	@Required()
	@DateSchema()
	public createdAt: string

	@Required()
	@DateSchema()
	public updatedAt: string
}

export class AuthenticatedRequest {
	@Required()
	@StringSchema()
	public authToken?: string
}
