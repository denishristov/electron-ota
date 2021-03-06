// tslint:disable:max-classes-per-file
import { StringSchema, Uri } from 'tsdv-joi/constraints/string'
import { Required, Allow } from 'tsdv-joi/constraints/any'

export class SignUploadUrlRequest {
	@Required()
	@StringSchema()
	public name: string

	@Allow('')
	@StringSchema()
	public type: string
}

export class SignUploadUrlResponse {
	@Required()
	@Uri()
	public signedRequest: string

	@Required()
	@Uri()
	public downloadUrl: string
}
