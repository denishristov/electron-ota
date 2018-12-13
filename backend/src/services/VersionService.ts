import Version from "../models/Version"
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

export interface IVersionService {
	getVersions({ appId }: IGetVersionsRequest): Promise<IGetVersionsResponse>
	createVersion(createRequest: ICreateVersionRequest): Promise<ICreateVersionResponse>
	updateVersion(updateRequest: IUpdateVersionRequest): Promise<IUpdateVersionResponse>
	deleteVersion({ id, appId }: IDeleteVersionRequest): Promise<IDeleteVersionResponse>
}

export default class VersionService {
	async getVersions({ appId }: IGetVersionsRequest): Promise<IGetVersionsResponse> {
		const versions = await Version.find({ appId })

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
		} = await Version.create(createRequest)

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
		await Version.find(id, { $set: app })
		return updateRequest  
	}

	async deleteVersion({ id, appId }: IDeleteVersionRequest): Promise<IDeleteVersionResponse> {
		await Version.deleteOne({ _id: id })
		return { id, appId }
	}
}