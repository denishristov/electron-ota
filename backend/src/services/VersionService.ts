import {
	GetVersionRequest,
	CreateVersionRequest,
	DeleteVersionRequest,
	DeleteVersionResponse,
	UpdateVersionRequest,
	UpdateVersionResponse,
	VersionRequest,
	VersionModel,
} from 'shared'
import { Version } from '../models/Version'
import { App } from '../models/App'
import { VersionReports } from '../models/VersionReports'
import { ModelType } from 'typegoose'
import { IFileUploadService } from './S3Service'

export interface IVersionService {
	getVersion({ id }: GetVersionRequest): Promise<VersionRequest>
	createVersion(createRequest: CreateVersionRequest): Promise<VersionModel>
	updateVersion(updateRequest: UpdateVersionRequest): Promise<UpdateVersionResponse>
	deleteVersion({ id }: DeleteVersionRequest): Promise<DeleteVersionResponse>
}

@DI.injectable()
export default class VersionService implements IVersionService {
	constructor(
		@DI.inject(DI.Models.Version)
		public readonly VersionModel: ModelType<Version>,
		@DI.inject(DI.Models.App)
		private readonly AppModel: ModelType<App>,
		@DI.inject(DI.Models.VersionReports)
		private readonly VersionReportsModel: ModelType<VersionReports>,
		@DI.inject(DI.Services.FileUpload)
		private readonly fileService: IFileUploadService,
	) {}

	@bind
	public async getVersion({ id }: GetVersionRequest): Promise<VersionRequest> {
		const version = await this.VersionModel.findById(id)

		return version.toJSON()
	}

	@bind
	public async createVersion(req: CreateVersionRequest): Promise<VersionModel> {
		const { VersionModel, VersionReportsModel } = this

		const version = new VersionModel(req)
		await version.save()

		const reports = new VersionReportsModel({ version })
		await reports.save()

		await this.AppModel.findByIdAndUpdate(req.appId, {
			$push: { versions: version },
		})

		return version.toJSON()
	}

	@bind
	public async updateVersion(update: UpdateVersionRequest): Promise<UpdateVersionResponse> {
		await this.VersionModel.findByIdAndUpdate(update.id, update)
		return update
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
