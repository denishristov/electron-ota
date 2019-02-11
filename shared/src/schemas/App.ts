// tslint:disable:max-classes-per-file
import { VersionModel } from './Version'
import { Nested, NestedArray } from 'tsdv-joi'
import { Token, StringSchema, Uri } from 'tsdv-joi/constraints/string'
import { Required, Allow, Strict } from 'tsdv-joi/constraints/any'
import { NumberSchema } from 'tsdv-joi/constraints/number'
import { AuthenticatedRequest, TimestampedDocument } from './Generic'

export class LatestVersionsModel {
	@Allow(null)
	@Nested()
	// tslint:disable-next-line:variable-name
	public Windows_RT?: VersionModel | null

	@Allow(null)
	@Nested()
	public Darwin?: VersionModel | null

	@Allow(null)
	@Nested()
	public Linux?: VersionModel | null
}

export class AppModel extends TimestampedDocument {
	@Required()
	@Token()
	public id: string

	@Required()
	@StringSchema()
	public name: string

	@Uri()
	public pictureUrl?: string

	@Required()
	@StringSchema()
	public bundleId: string

	@Nested()
	public latestVersions?: LatestVersionsModel

	@Required()
	@NumberSchema()
	public versions: number
}

export class GetAppsResponse {
	@NestedArray(AppModel)
	public apps: AppModel[]
}

export class CreateAppRequest extends AuthenticatedRequest {
	@Required()
	@StringSchema()
	public name: string

	@Uri()
	public pictureUrl: string

	@Required()
	@StringSchema()
	public bundleId: string
}

export class CreateAppResponse extends AppModel {}

export class UpdateAppRequest extends AuthenticatedRequest {
	@Required()
	@Token()
	public id: string

	@StringSchema()
	public name?: string

	@Uri()
	public pictureUrl?: string

	@StringSchema()
	public bundleId?: string

	// public latestVersion?: string
}

export class UpdateAppResponse {
	@Required()
	@Token()
	public id: string

	@StringSchema()
	public name?: string

	@Uri()
	public pictureUrl?: string

	@StringSchema()
	public bundleId?: string
}

export class DeleteAppRequest extends AuthenticatedRequest {
	@Required()
	@Token()
	public id: string
}

export class DeleteAppResponse extends DeleteAppRequest {}
