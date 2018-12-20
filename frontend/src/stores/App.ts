import { action, computed, observable, ObservableMap } from 'mobx'
import {
	EventType,
	IAppModel,
	ICreateVersionResponse,
	IGetVersionsResponse,
	IS3SignUrlRequest,
	IS3SignUrlResponse,
	IVersionModel,
} from 'shared'
import { IApi } from '../util/Api'

import { inject } from 'inversify'
import { TYPES } from '../util/types'

interface ICreateVersionInput {
	versionName: string
	isCritical: boolean
	isBase: boolean
	downloadUrl: string
}

export default class App {
	public id: string

	@observable
	public name: string

	@observable
	public pictureUrl: string

	@observable
	public bundleId: string

	public readonly versions: ObservableMap = observable.map({})

	constructor(
		{ id, name, pictureUrl, bundleId }: IAppModel,
		private api: IApi,
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
	public async fetchVersions() {
		const { versions } = await this.api.emit<IGetVersionsResponse>(EventType.GetVersions, { appId: this.id })

		this.versions.merge(versions.group((version) => [version.id, version]))
	}

	@action
	public async fetchSignedUploadVersionUrl(req: IS3SignUrlRequest) {
		// tslint:disable-next-line:no-console
		console.log('tumor')
		return await this.api.emit<IS3SignUrlResponse>(EventType.SignUploadVersionUrl, req)
	}

	public emitCreateVersion(inputFields: ICreateVersionInput) {
		this.api.emit<ICreateVersionResponse>(EventType.CreateVersion, { appId: this.id, ...inputFields })
	}

	// emitUpdateVersion(inputFields: ICreateVersionInput) {
	// 	this.api.emit<ICreateVersionResponse>(EventType.CreateApp, { appId: this.id, ...inputFields })
	// }

	// emitDeleteVersion(inputFields: ICreateVersionInput) {
	// 	this.api.emit<ICreateVersionResponse>(EventType.CreateApp, { appId: this.id, ...inputFields })
	// }
}
