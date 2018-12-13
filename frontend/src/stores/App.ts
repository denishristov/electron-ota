import { observable, ObservableMap, action } from "mobx";
import { IAppModel, IGetVersionsRequest, EventType, IGetVersionsResponse, ICreateVersionRequest, ICreateVersionResponse, IUpdateVersionResponse } from "shared";
import { IApi } from "../util/Api";

interface ICreateVersionInput {
	versionName: string
	isCritical: boolean
	isBase: boolean
}

export default class App {
	id: string

	@observable
	name: string

	@observable
	pictureUrl: string

	@observable
	bundleId: string

	private readonly versions: ObservableMap = observable.map({})

	constructor({ id, name, pictureUrl, bundleId }: IAppModel, private readonly api: IApi) {
		this.id = id
		this.name = name
		this.pictureUrl = pictureUrl
		this.bundleId = bundleId

		this.api.on(EventType.CreateVersion, this.handleCreateVersion)
		this.api.on(EventType.UpdateVersion, this.handleUpdateVersion)
		this.api.on(EventType.DeleteVersion, this.handleDeleteVersion)
	}

	@action
	async fetchVersions() {
		const { versions } = await this.api.emit<IGetVersionsResponse>(EventType.GetVersions, { id: this.id })
		
		this.versions.merge(versions.group(version => [version.id, version]))
	}

	@action.bound
	handleCreateVersion(response: ICreateVersionResponse) {
		this.versions.set(response.id, response)
	}

	@action.bound
	handleUpdateVersion(response: IUpdateVersionResponse) {
		// const existingVersion = this.versions.get(response.app)
	}

	@action.bound
	handleDeleteVersion(response: ICreateVersionResponse) {
		// this.versions.set(response.id, response)
	}

	emitCreateVersion(inputFields: ICreateVersionInput) {
		this.api.emit<ICreateVersionResponse>(EventType.CreateApp, { appId: this.id, ...inputFields })
	}

	// emitUpdateVersion(inputFields: ICreateVersionInput) {
	// 	this.api.emit<ICreateVersionResponse>(EventType.CreateApp, { appId: this.id, ...inputFields })
	// }

	// emitDeleteVersion(inputFields: ICreateVersionInput) {
	// 	this.api.emit<ICreateVersionResponse>(EventType.CreateApp, { appId: this.id, ...inputFields })
	// }
}