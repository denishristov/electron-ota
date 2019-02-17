import { observable, action } from 'mobx'
import { IFileService } from '../services/FileService'
import { IUploadService } from '../services/UploadService'
import { IApp } from './App'
import { ToggleNames } from '../util/enums'

type Toggles = {
	[name in ToggleNames]: boolean
}

export interface IVersionFormData {
	versionName: string
	description: string
	version?: File
}

export interface IVersionModalStore extends Toggles {
	versionName?: string
	toggles: { [x: string]: () => void }
	handleSubmit(data: IVersionFormData): Promise<void>
}

export default abstract class VersionModalStore implements IVersionModalStore {
	@observable
	public versionName?: string

	@observable
	public isCritical: boolean = false

	@observable
	public isReleasing: boolean = false

	@observable
	public isBase: boolean = false

	@observable
	public isWindows: boolean = true

	@observable
	public isDarwin: boolean = true

	@observable
	public isLinux: boolean = true

	public readonly toggles = Object.keys(ToggleNames)
		.group((name) => [name, action(() => this[name] = !this[name])])

	constructor(
		protected readonly fileService: IFileService,
		protected readonly uploadService: IUploadService,
		protected readonly app: IApp,
	) {}

	public abstract handleSubmit(data: IVersionFormData): Promise<void>
}
