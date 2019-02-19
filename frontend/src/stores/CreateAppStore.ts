import { IAppsStore } from './AppsStore'
import { IUploadService } from '../services/UploadService'
import { IAppModalStore } from './AppModalStore'

interface IFormData {
	name: string
	bundleId: string
}

export interface ICreateAppStore {
	appModalStore: IAppModalStore
	handleCreate(data: IFormData): Promise<void>
}

@DI.injectable()
export default class CreateAppStore implements ICreateAppStore {
	constructor(
		@DI.inject(DI.Stores.Apps)
		private readonly appsStore: IAppsStore,
		@DI.inject(DI.Services.Upload)
		private readonly uploadService: IUploadService,
		@DI.inject(DI.Stores.AppModal)
		public readonly appModalStore: IAppModalStore,
	) {}

	@bind
	public async handleCreate({ name, bundleId }: IFormData) {
		let pictureUrl

		const { picture, color } = this.appModalStore

		if (picture) {
			const upload = await this.uploadService.uploadPicture(picture)

			await upload.upload

			pictureUrl = upload.downloadUrl
		}

		await this.appsStore.createApp({
			bundleId,
			name,
			pictureUrl,
			color,
		})
	}
}
