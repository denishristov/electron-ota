// tslint:disable:max-classes-per-file
import { StringSchema, Uri } from 'tsdv-joi/constraints/string'
import { Required, Allow } from 'tsdv-joi/constraints/any'
import { AuthenticatedRequest } from './Generic'

export class S3SignUrlRequest extends AuthenticatedRequest {
	@Required()
	@StringSchema()
	public name: string

	@Allow('')
	@StringSchema()
	public type: string
}

export class S3SignUrlResponse {
	@Required()
	@Uri()
	public signedRequest: string

	@Required()
	@Uri()
	public downloadUrl: string
}
