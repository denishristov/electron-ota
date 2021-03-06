import {
	CreateVersionRequest,
	DeleteVersionRequest,
	DeleteVersionResponse,
	UpdateVersionRequest,
	UpdateVersionResponse,
	VersionModel,
} from 'shared'
import { ModelType } from 'typegoose'

import { App } from '../models/App'
import { Version } from '../models/Version'
import { VersionReports } from '../models/VersionReports'
import { IFileUploadService } from './S3Service'

export interface IVersionService {
	createVersion(createRequest: CreateVersionRequest): Promise<VersionModel>
	updateVersion(updateRequest: UpdateVersionRequest): Promise<UpdateVersionResponse>
	deleteVersion({ id }: DeleteVersionRequest): Promise<DeleteVersionResponse>
}

@injectable()
export default class VersionService implements IVersionService {
	constructor(
		@inject(nameof<Version>())
		public readonly VersionModel: ModelType<Version>,
		@inject(nameof<App>())
		private readonly AppModel: ModelType<App>,
		@inject(nameof<VersionReports>())
		private readonly VersionReportsModel: ModelType<VersionReports>,
		@inject(nameof<IFileUploadService>())
		private readonly fileService: IFileUploadService,
	) {}

	@bind
	public async createVersion(versionData: CreateVersionRequest): Promise<VersionModel> {
		const { VersionModel, VersionReportsModel } = this

		const version = new VersionModel(versionData)
		await version.save()

		const reports = new VersionReportsModel({ version })
		await reports.save()

		await this.AppModel.findByIdAndUpdate(versionData.appId, {
			$push: { versions: version },
		})

		return version.toJSON()
	}

	@bind
	public async updateVersion(update: UpdateVersionRequest): Promise<UpdateVersionResponse> {
		return await this.VersionModel.findByIdAndUpdate(update.id, update, { new: true })
	}

	@bind
	public async deleteVersion({ id, appId }: DeleteVersionRequest): Promise<DeleteVersionResponse> {
		const version = await this.VersionModel.findById(id).select('fileName')

		if (version.fileName) {
			await this.fileService.deleteVersion(version.fileName)
		}

		await this.AppModel.findByIdAndUpdate(appId, {
			$pull: { versions: id },
		})

		await version.remove()

		return { id, appId }
	}
}
