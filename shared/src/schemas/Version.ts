// tslint:disable:max-classes-per-file
import { TimestampedDocument } from './Generic'
import { SystemType } from '../enums/SystemType'
import { Token, StringSchema, Uri } from 'tsdv-joi/constraints/string'
import { Required } from 'tsdv-joi/constraints/any'
import { BooleanSchema } from 'tsdv-joi/constraints/boolean'
import { Nested, NestedArray } from 'tsdv-joi'

class SystemSupport {
	@Required()
	@BooleanSchema()
	public Darwin: boolean

	@Required()
	@BooleanSchema()
	public Linux: boolean

	@Required()
	@BooleanSchema()
	// tslint:disable-next-line:variable-name
	public Windows_RT: boolean
}

export class VersionModel extends TimestampedDocument {
	@Required()
	@Token()
	public id: string

	@Required()
	@StringSchema()
	public versionName: string

	@Uri()
	public downloadUrl?: string

	@Required()
	@BooleanSchema()
	public isCritical: boolean

	@Required()
	@BooleanSchema()
	public isBase: boolean

	@Required()
	@Token()
	public appId: string

	@StringSchema()
	public description?: string

	@Token()
	public hash: string

	@Required()
	@Nested()
	public systems: SystemSupport
}

export class VersionEditModel {
	@Required()
	@Token()
	public id: string

	@Required()
	@Token()
	public appId: string

	@StringSchema()
	public versionName?: string

	@StringSchema()
	public description?: string

	@BooleanSchema()
	public isCritical?: boolean

	@Nested()
	public systems: SystemSupport
}

export class VersionRequest {
	@Required()
	@Token()
	public appId: string
}

export class VersionResponse {
	@Required()
	@Token()
	public appId: string
}

export class GetVersionRequest {
	@Required()
	@Token()
	public id: string
}

export class GetVersionResponse extends VersionModel {}

export class GetVersionByNameRequest {
	@StringSchema()
	public versionName: string
}

export class GetVersionByNameResponse extends VersionModel {}

export class GetVersionsRequest extends VersionRequest {}

export class GetVersionsResponse {
	@NestedArray(VersionModel)
	public versions: VersionModel[]
}

export class CreateVersionRequest extends VersionRequest {
	@Required()
	@StringSchema()
	public versionName: string

	@Uri()
	public downloadUrl?: string

	@Required()
	@BooleanSchema()
	public isCritical: boolean

	@Required()
	@BooleanSchema()
	public isBase: boolean

	@Required()
	@Token()
	public appId: string

	@StringSchema()
	public description?: string

	@Token()
	public hash: string

	@Required()
	@Nested()
	public systems: SystemSupport
}

export class CreateVersionResponse extends VersionModel {}

export class UpdateVersionRequest extends VersionEditModel {}

export class UpdateVersionResponse extends VersionEditModel {}

export class DeleteVersionRequest extends VersionRequest {
	@Required()
	@Token()
	public id: string
}

export class DeleteVersionResponse extends VersionResponse {
	@Required()
	@Token()
	public id: string
}
