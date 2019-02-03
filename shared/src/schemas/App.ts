// tslint:disable:max-classes-per-file
import { VersionModel } from './Version'
import { Nested, NestedArray } from 'tsdv-joi'
import { Token, StringSchema, Uri } from 'tsdv-joi/constraints/string'
import { Required } from 'tsdv-joi/constraints/any'
import { NumberSchema } from 'tsdv-joi/constraints/number'

export class AppModel {
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
	public latestVersion?: VersionModel

	@Required()
	@NumberSchema()
	public versions: number
}

export class GetAppsResponse {
	@NestedArray(AppModel)
	public apps: AppModel[]
}

export class CreateAppRequest {
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

export class UpdateAppRequest {
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

export class UpdateAppResponse extends UpdateAppRequest {}

export class DeleteAppRequest {
	@Required()
	@Token()
	public id: string
}

export class DeleteAppResponse extends DeleteAppRequest {}
