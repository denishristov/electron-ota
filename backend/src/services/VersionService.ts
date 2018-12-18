import { IVersionDocument } from "../models/Version"
import { 
	IGetVersionsRequest, 
	ICreateVersionRequest, 
	ICreateVersionResponse, 
	IUpdateVersionRequest, 
	IUpdateVersionResponse,
	IDeleteVersionRequest, 
	IDeleteVersionResponse, 
	IGetVersionsResponse
} from "shared"
import { injectable, inject } from "inversify"
import { Models } from "../dependencies/symbols";
import { Model } from "mongoose";

export interface IVersionService {
	getVersions({ appId }: IGetVersionsRequest): Promise<IGetVersionsResponse>
	createVersion(createRequest: ICreateVersionRequest): Promise<ICreateVersionResponse>
	updateVersion(updateRequest: IUpdateVersionRequest): Promise<IUpdateVersionResponse>
	deleteVersion({ id, appId }: IDeleteVersionRequest): Promise<IDeleteVersionResponse>
}

@injectable()
export default class VersionService {
	constructor(
		@inject(Models.Version) private readonly versionModel: Model<IVersionDocument>
	) {}

	async getVersions({ appId }: IGetVersionsRequest): Promise<IGetVersionsResponse> {
		const versions = await this.versionModel.find({ appId })

		return {
			versions: versions.map(({
				id,
				versionName,
				downloadUrl,
				isCritical,
				isBase,
				isPublished,
				appId,
			}) => ({
				id,
				versionName,
				downloadUrl,
				isCritical,
				isBase,
				isPublished,
				appId,
			}))
		}
		// .toObject(versions => [versions.id, versions]) as IGetVersionsResponse
	}

	async createVersion(createRequest: ICreateVersionRequest): Promise<ICreateVersionResponse> {
		const {
			id,
			versionName,
			downloadUrl,
			isCritical,
			isBase,
			isPublished,
			appId,
		} = await this.versionModel.create(createRequest)

		return {
			id,
			versionName,
			downloadUrl,
			isCritical,
			isBase,
			isPublished,
			appId,
		}
	}

	async updateVersion(updateRequest: IUpdateVersionRequest): Promise<IUpdateVersionResponse> {
		const { id, ...app } = updateRequest
		await this.versionModel.find(id, { $set: app })
		return updateRequest  
	}

	async deleteVersion({ id, appId }: IDeleteVersionRequest): Promise<IDeleteVersionResponse> {
		await this.versionModel.deleteOne({ _id: id })
		return { id, appId }
	}
}