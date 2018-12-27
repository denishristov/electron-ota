
import { Model } from 'mongoose'
import {
	IGetVersionRequest,
	ICreateVersionRequest,
	ICreateVersionResponse,
	IDeleteVersionRequest,
	IDeleteVersionResponse,
	IGetVersionsRequest,
	IGetVersionsResponse,
	IUpdateVersionRequest,
	IUpdateVersionResponse,
	IGetVersionResponse,
	IPublishVersionRequest,
	IPublishVersionResponse,
} from 'shared'
import { IVersionDocument } from '../models/Version'
import { IAppService } from './AppService'

export interface IVersionService {
	getVersion({ id }: IGetVersionRequest): Promise<IGetVersionResponse>
	getVersions({ appId }: IGetVersionsRequest): Promise<IGetVersionsResponse>
	createVersion(createRequest: ICreateVersionRequest): Promise<ICreateVersionResponse>
	updateVersion(updateRequest: IUpdateVersionRequest): Promise<IUpdateVersionResponse>
	deleteVersion({ id, appId }: IDeleteVersionRequest): Promise<IDeleteVersionResponse>
	publishVersion(req: IPublishVersionRequest): Promise<IPublishVersionResponse>
}

@DI.injectable()
export default class VersionService implements IVersionService {
	constructor(
		@DI.inject(DI.Models.Version) private readonly versionModel: Model<IVersionDocument>,
		@DI.inject(DI.Services.App) private readonly appService: IAppService,
	) {}

	@bind
	public async getVersion({ id }: IGetVersionRequest): Promise<IGetVersionResponse> {
		const {
			appId,
			downloadUrl,
			isBase,
			isCritical,
			isPublished,
			versionName,
			hash,
		} = await this.versionModel.findById(id)

		return {
			appId,
			downloadUrl,
			id,
			isBase,
			isCritical,
			isPublished,
			versionName,
			hash,
		}
	}

	@bind
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
				hash,
			}) => ({
				appId,
				downloadUrl,
				id,
				isBase,
				isCritical,
				isPublished,
				versionName,
				hash,
			})),
		}
	}

	@bind
	public async createVersion(createRequest: ICreateVersionRequest): Promise<ICreateVersionResponse> {
		const {
			appId,
			downloadUrl,
			id,
			isBase,
			isCritical,
			versionName,
			hash,
		} = await this.versionModel.create(createRequest)

		return {
			appId,
			downloadUrl,
			id,
			isBase,
			isCritical,
			versionName,
			isPublished: false,
			hash,
		}
	}

	@bind
	public async updateVersion(updateRequest: IUpdateVersionRequest): Promise<IUpdateVersionResponse> {
		const { id, ...app } = updateRequest
		await this.versionModel.updateOne({ _id: id }, { $set: app })
		return updateRequest
	}

	@bind
	public async deleteVersion({ id, appId }: IDeleteVersionRequest): Promise<IDeleteVersionResponse> {
		await this.versionModel.deleteOne({ _id: id })
		return { id, appId }
	}

	@bind
	public async publishVersion(req: IPublishVersionRequest): Promise<IPublishVersionResponse> {
		try {
			await this.updateVersion({ ...req, isPublished: true })
			await this.appService.updateApp({ id: req.appId, latestVersion: req.id })

			return {
				isSuccessful: true,
			}
		} catch (error) {
			return {
				isSuccessful: false,
				errorMessage: error.message,
			}
		}
	}
}
