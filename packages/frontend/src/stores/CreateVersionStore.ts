import { IVersionFormData, IVersionModalStore } from './VersionModalStore'
import { observable, computed, action } from 'mobx'
import { ReleaseType } from '../util/enums'
import { IFileService } from '../services/FileService'
import { IUploadService } from '../services/UploadService'
import { IApp } from './App'
import semver from 'semver'
import { CancelTokenSource } from 'axios'

export interface ICreateVersionStore  {
	versionModalStore: IVersionModalStore
	isUploading: boolean
	isValid: boolean
	versionFile?: File
	progress?: number
	releaseType: ReleaseType
	previousVersionName: string | null
	releaseTypeSetters: { [x: string]: () => void }
	cancelTokenSource?: CancelTokenSource
	handleDrop(files: File[]): void
	handleCreate({ versionName, description, password }: IVersionFormData): Promise<void>
}

export default class CreateVersionStore implements ICreateVersionStore {
	@observable
	public versionFile?: File

	@observable
	public progress?: number

	@observable
	public releaseType = ReleaseType.Custom

	public readonly releaseTypeSetters = Object.values(ReleaseType)
		.group((releaseType) => [releaseType, this.setReleaseType.bind(this, releaseType)])

	public cancelTokenSource: CancelTokenSource

	constructor(
		private readonly fileService: IFileService,
		private readonly uploadService: IUploadService,
		private readonly app: IApp,
		public readonly versionModalStore: IVersionModalStore,
		public readonly previousVersionName: string | null,
	) {
		if (previousVersionName) {
			const newName = semver.inc(previousVersionName, ReleaseType.Patch) || void 0

			if (newName) {
				this.versionModalStore.versionName = newName
				this.releaseType = ReleaseType.Patch
			}
		}
	}

	@computed
	get isValid() {
		return Boolean(
			this.versionModalStore.versionName && (this.versionModalStore.isBase || this.versionFile),
		)
	}

	@computed
	public get isUploading() {
		return typeof this.progress === 'number'
	}

	@action
	public async handleCreate({ versionName, description, password }: IVersionFormData) {
		const {
			isReleasing,
			isCritical,
			isBase,
			isWindows,
			isDarwin,
			isLinux,
		} = this.versionModalStore

		const { versionFile } = this

		if (!versionFile && !isBase) {
			throw new Error('Version file not supplied')
		}

		let hash
		let downloadUrl
		let fileName

		if (versionFile) {
			fileName = `${this.app.bundleId}-${versionName}-${Date.now()}.asar`
			const upload = await this.uploadService.uploadVersion(fileName, versionFile)

			this.cancelTokenSource = upload.cancelSource

			upload.onProgress((progress) => {
				this.progress = progress
			})

			const [calculatedHash] = await Promise.all([
				this.fileService.hashFile(versionFile),
				upload.upload,
			])

			if (!calculatedHash) {
				throw new Error('Error hashing file')
			}

			hash = calculatedHash
			downloadUrl = upload.downloadUrl
		}

		this.app.createVersion({
			versionName,
			description,
			downloadUrl,
			hash,
			isBase,
			isCritical,
			fileName,
			isReleasing,
			password,
			systems: {
				Windows_RT: isWindows,
				Darwin: isDarwin,
				Linux: isLinux,
			},
		})
	}

	@action
	public setReleaseType(releaseType: ReleaseType) {
		this.releaseType = releaseType

		if (releaseType !== ReleaseType.Custom && this.previousVersionName) {
			const newName = semver.inc(this.previousVersionName, releaseType) || void 0
			if (newName) {
				this.versionModalStore.versionName = newName
			}
		}
	}

	@action.bound
	public handleDrop([version]: File[]) {
		this.versionFile = version
	}
}
