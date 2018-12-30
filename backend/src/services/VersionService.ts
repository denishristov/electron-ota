
import { Model } from 'mongoose'
import {
	IGetVersionRequest,
	ICreateVersionRequest,
	ICreateVersionResponse,
	IDeleteVersionRequest,
	IDeleteVersionResponse,
	IGetVersionsResponse,
	IUpdateVersionRequest,
	IUpdateVersionResponse,
	IGetVersionResponse,
	IPublishVersionRequest,
	IPublishVersionResponse,
} from 'shared'
import { IVersionDocument } from '../models/Version'
import { IAppService } from './AppService'
import { toPlain } from '../util/util'

export interface IVersionService {
	getVersion({ id, appId }: IGetVersionRequest): Promise<IGetVersionResponse>
	getVersions({ appId }: IGetVersionRequest): Promise<IGetVersionsResponse>
	createVersion(createRequest: ICreateVersionRequest): Promise<ICreateVersionResponse>
	updateVersion(updateRequest: IUpdateVersionRequest): Promise<IUpdateVersionResponse>
	deleteVersion({ id }: IDeleteVersionRequest): Promise<IDeleteVersionResponse>
	publishVersion(req: IPublishVersionRequest): Promise<IPublishVersionResponse>
}

@DI.injectable()
export default class VersionService implements IVersionService {
	constructor(
		@DI.inject(DI.Models.Version) private readonly versionModel: Model<IVersionDocument>,
		@DI.inject(DI.Services.App) private readonly appService: IAppService,
	) {}

	@bind
	public async getVersion({ id, appId }: IGetVersionRequest): Promise<IGetVersionResponse> {
		const { versions } = await this.appService.getApp(appId, { versions: true })
		const version = versions.find((version) => version.id === id)

		return toPlain(version)
	}

	@bind
	public async getVersions({ appId }: IGetVersionRequest): Promise<IGetVersionsResponse> {
		const da = await this.appService.getApp(appId, { versions: true })

		return {
			versions: da.versions.map(toPlain),
		}
	}

	@bind
	public async createVersion(create: ICreateVersionRequest): Promise<ICreateVersionResponse> {
		const version = await this.versionModel.create({ ...create, isPublished: false })
		const app = await this.appService.getApp(create.appId)
		app.versions.push(version)
		app.save()

		return toPlain(version)
	}

	@bind
	public async updateVersion(update: IUpdateVersionRequest): Promise<IUpdateVersionResponse> {
		const { id, ...app } = update
		await this.versionModel.updateOne({ _id: id }, { $set: app })
		return update
	}

	@bind
	public async deleteVersion({ id, appId }: IDeleteVersionRequest): Promise<IDeleteVersionResponse> {
		await this.versionModel.deleteOne({ _id: id })
		return { id, appId }
	}

	@bind
	public async publishVersion({ appId, id }: IPublishVersionRequest): Promise<IPublishVersionResponse> {
		try {
			await this.updateVersion({ appId, id, isPublished: true })
			await this.appService.updateApp({ id: appId, latestVersion: id })

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
