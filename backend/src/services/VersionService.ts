import { inject, injectable } from 'inversify'
import { Model } from 'mongoose'
import {
	ICreateVersionRequest,
	ICreateVersionResponse,
	IDeleteVersionRequest,
	IDeleteVersionResponse,
	IGetVersionsRequest,
	IGetVersionsResponse,
	IUpdateVersionRequest,
	IUpdateVersionResponse,
} from 'shared'
import { Models } from '../dependencies/symbols'
import { IVersionDocument } from '../models/Version'

export interface IVersionService {
	getVersions({ appId }: IGetVersionsRequest): Promise<IGetVersionsResponse>
	createVersion(createRequest: ICreateVersionRequest): Promise<ICreateVersionResponse>
	updateVersion(updateRequest: IUpdateVersionRequest): Promise<IUpdateVersionResponse>
	deleteVersion({ id, appId }: IDeleteVersionRequest): Promise<IDeleteVersionResponse>
}

@injectable()
export default class VersionService {
	constructor(
		@inject(Models.Version) private readonly versionModel: Model<IVersionDocument>,
	) {}

	public async getVersions({ appId }: IGetVersionsRequest): Promise<IGetVersionsResponse> {
		const versions = await this.versionModel.find({ appId })

		return {
			versions: versions.map(({
				appId,
				downloadUrl,
				id,
				isBase,
				isCritical,
				isPublished,
				versionName,
			}) => ({
				appId,
				downloadUrl,
				id,
				isBase,
				isCritical,
				isPublished,
				versionName,
			})),
		}
		// .toObject(versions => [versions.id, versions]) as IGetVersionsResponse
	}

	public async createVersion(createRequest: ICreateVersionRequest): Promise<ICreateVersionResponse> {
		const {
			appId,
			downloadUrl,
			id,
			isBase,
			isCritical,
			isPublished,
			versionName,
		} = await this.versionModel.create(createRequest)

		return {
			appId,
			downloadUrl,
			id,
			isBase,
			isCritical,
			isPublished,
			versionName,
		}
	}

	public async updateVersion(updateRequest: IUpdateVersionRequest): Promise<IUpdateVersionResponse> {
		const { id, ...app } = updateRequest
		await this.versionModel.find(id, { $set: app })
		return updateRequest
	}

	public async deleteVersion({ id, appId }: IDeleteVersionRequest): Promise<IDeleteVersionResponse> {
		await this.versionModel.deleteOne({ _id: id })
		return { id, appId }
	}
}
