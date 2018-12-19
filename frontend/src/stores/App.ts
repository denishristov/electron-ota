import { observable, ObservableMap, action, computed } from "mobx";
import { 
	IAppModel, 
	EventType, 
	IGetVersionsResponse, 
	ICreateVersionResponse, 
	IVersionModel, 
	IS3SignUrlRequest,
	IS3SignUrlResponse
} from "shared";
import { IApi } from "../util/Api";

import { TYPES } from "../util/types";
import { inject } from "inversify";

interface ICreateVersionInput {
	versionName: string
	isCritical: boolean
	isBase: boolean
	downloadUrl: string
}

export default class App {
	id: string

	@observable
	name: string

	@observable
	pictureUrl: string

	@observable
	bundleId: string

	readonly versions: ObservableMap = observable.map({})

	constructor(
		{ id, name, pictureUrl, bundleId }: IAppModel,
		private api: IApi
	) {
		this.id = id
		this.name = name
		this.pictureUrl = pictureUrl
		this.bundleId = bundleId
	}

	@computed
	get renderableVersions(): IVersionModel[] {
		return [...this.versions.values()]
	}

	@action
	async fetchVersions() {
		const { versions } = await this.api.emit<IGetVersionsResponse>(EventType.GetVersions, { appId: this.id })
		
		this.versions.merge(versions.group(version => [version.id, version]))
	}

	@action
	async fetchSignedUploadVersionUrl(req: IS3SignUrlRequest) {
		console.log('tumor');
		return await this.api.emit<IS3SignUrlResponse>(EventType.SignUploadVersionUrl, req)
	}

	emitCreateVersion(inputFields: ICreateVersionInput) {
		this.api.emit<ICreateVersionResponse>(EventType.CreateVersion, { appId: this.id, ...inputFields })
	}



	// emitUpdateVersion(inputFields: ICreateVersionInput) {
	// 	this.api.emit<ICreateVersionResponse>(EventType.CreateApp, { appId: this.id, ...inputFields })
	// }

	// emitDeleteVersion(inputFields: ICreateVersionInput) {
	// 	this.api.emit<ICreateVersionResponse>(EventType.CreateApp, { appId: this.id, ...inputFields })
	// }
}