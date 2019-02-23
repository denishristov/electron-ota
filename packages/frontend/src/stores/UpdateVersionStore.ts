import VersionModalStore, { IVersionFormData } from './VersionModalStore'
import { IFileService } from '../services/FileService'
import { IUploadService } from '../services/UploadService'
import { IApp } from './App'
import { VersionModel } from 'shared'
import { action, observable } from 'mobx'
import { IVersionModalStore } from './VersionModalStore'

export interface IUpdateVersionStore extends IVersionModalStore {
	description?: string
}

export default class UpdateVersionStore extends VersionModalStore implements IUpdateVersionStore {
	@observable
	public description?: string

	constructor(
		fileService: IFileService,
		uploadService: IUploadService,
		app: IApp,
		private readonly version: VersionModel,
	) {
		super(fileService, uploadService, app)

		const { versionName, description, isCritical, systems } = version

		this.versionName = versionName
		this.description = description
		this.isCritical = isCritical
		this.isDarwin = systems.Darwin
		this.isWindows = systems.Windows_RT
		this.isLinux = systems.Linux
	}

	@action.bound
	public async handleSubmit({
		versionName,
		description,
	}: IVersionFormData) {

		const {
			isCritical,
			isWindows,
			isDarwin,
			isLinux,
		} = this

		this.app.updateVersion({
			id: this.version.id,
			versionName,
			description,
			isCritical,
			systems: {
				Windows_RT: isWindows,
				Darwin: isDarwin,
				Linux: isLinux,
			},
		})
	}
}
