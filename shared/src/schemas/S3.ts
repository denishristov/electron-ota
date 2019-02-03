// tslint:disable:max-classes-per-file
import { StringSchema, Uri } from 'tsdv-joi/constraints/string'
import { Required } from 'tsdv-joi/constraints/any'

export class S3SignUrlRequest {
	@Required()
	@StringSchema()
	public name: string

	@Required()
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
