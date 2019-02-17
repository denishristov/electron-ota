import VersionModalStore, { IVersionFormData } from './VersionModalStore'
import { observable, computed, action } from 'mobx'
import { ReleaseType } from '../util/enums'
import { IFileService } from '../services/FileService'
import { IUploadService } from '../services/UploadService'
import { IApp } from './App'
import semver from 'semver'
import { CancelTokenSource } from 'axios'

export interface ICreateVersionStore extends VersionModalStore {
	isUploading: boolean
	isValid: boolean
	versionFile?: File
	progress?: number
	releaseType: ReleaseType
	previousVersionName: string | null
	releaseTypeSetters: { [x: string]: () => void }
	cancelTokenSource?: CancelTokenSource
	handleDrop(files: File[]): void
}

export default class CreateVersionStore extends VersionModalStore implements ICreateVersionStore {
	@observable
	public versionFile?: File

	@observable
	public progress?: number

	@observable
	public releaseType = ReleaseType.Custom

	public readonly releaseTypeSetters = Object.values(ReleaseType)
		.group((releaseType) => [releaseType, () => this.releaseType = releaseType])

	public cancelTokenSource: CancelTokenSource

	constructor(
		fileService: IFileService,
		uploadService: IUploadService,
		app: IApp,
		public readonly previousVersionName: string | null,
	) {
		super(fileService, uploadService, app)

		if (previousVersionName) {
			this.versionName = semver.inc(previousVersionName, ReleaseType.Patch) || void 0
			this.releaseType = ReleaseType.Patch
		}
	}

	@computed
	get isValid() {
		return Boolean(this.versionName && (this.isBase || this.versionFile))
	}

	@computed
	public get isUploading() {
		return typeof this.progress === 'number'
	}

	@action.bound
	public async handleSubmit({ versionName, description }: IVersionFormData) {
		const {
			isReleasing,
			isCritical,
			isBase,
			isWindows,
			isDarwin,
			isLinux,
			versionFile,
		} = this

		if (!versionFile && !isBase) {
			throw new Error('Version file not supplied')
		}

		let hash
		let downloadUrl

		if (versionFile) {
			const upload = await this.uploadService.uploadVersion(versionName, this.app.bundleId, versionFile)

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
			systems: {
				Windows_RT: isWindows,
				Darwin: isDarwin,
				Linux: isLinux,
			},
		})
	}

	@action.bound
	public setReleaseType(releaseType: ReleaseType) {
		if (releaseType !== ReleaseType.Custom && this.previousVersionName) {
			this.versionName = semver.inc(this.previousVersionName, releaseType) || void 0
		}
	}

	@action.bound
	public handleDrop([version]: File[]) {
		this.versionFile = version
	}

	// private handleReleaseVersion(version: VersionModel) {
	// 	// this.props.appsStore.emitPublishVersion({
	// 	// 	versionId: version.id,
	// 	// })
	// }
}
