// tslint:disable:max-classes-per-file
import { TimestampedDocument } from './Generic'
import { SystemType } from '../enums/SystemType'
import { Token, StringSchema, Uri } from 'tsdv-joi/constraints/string'
import { Required } from 'tsdv-joi/constraints/any'
import { BooleanSchema } from 'tsdv-joi/constraints/boolean'
import { Nested, NestedArray } from 'tsdv-joi'

class SystemSupport {
	@BooleanSchema()
	@Required()
	public Darwin: boolean

	@BooleanSchema()
	@Required()
	public Linux: boolean

	@BooleanSchema()
	@Required()
	public Windows_RT: boolean
}
export class VersionModel extends TimestampedDocument {
	@Token()
	@Required()
	public id: string

	@StringSchema()
	@Required()
	public versionName: string

	@Uri()
	public downloadUrl?: string

	@BooleanSchema()
	@Required()
	public isCritical: boolean

	@BooleanSchema()
	@Required()
	public isBase: boolean

	@Token()
	@Required()
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
	@Token()
	@Required()
	public id: string

	@Token()
	@Required()
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
	@Token()
	@Required()
	public appId: string
}

export class VersionResponse {
	@Token()
	@Required()
	public appId: string
}

export class GetVersionRequest {
	@Token()
	@Required()
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
	@StringSchema()
	@Required()
	public versionName: string

	@Uri()
	public downloadUrl?: string

	@BooleanSchema()
	@Required()
	public isCritical: boolean

	@BooleanSchema()
	@Required()
	public isBase: boolean

	@Token()
	@Required()
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
	@Token()
	@Required()
	public id: string
}

export class DeleteVersionResponse extends VersionResponse {
	@Token()
	@Required()
	public id: string
}
