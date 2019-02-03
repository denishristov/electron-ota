import { StringSchema, Uri } from 'tsdv-joi/constraints/string';
import { Required } from 'tsdv-joi/constraints/any';

// tslint:disable:max-classes-per-file

export class S3SignUrlRequest {
	@StringSchema()
	@Required()
	public name: string

	@StringSchema()
	@Required()
	public type: string
}

export class S3SignUrlResponse {
	@Uri()
	@Required()
	public signedRequest: string

	@Uri()
	@Required()
	public downloadUrl: string
}
