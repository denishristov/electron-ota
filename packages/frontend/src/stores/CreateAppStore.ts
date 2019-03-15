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

@injectable()
export default class CreateAppStore implements ICreateAppStore {
	constructor(
		@inject(nameof<IAppsStore>())
		private readonly appsStore: IAppsStore,
		@inject(nameof<IUploadService>())
		private readonly uploadService: IUploadService,
		@inject(nameof<IAppModalStore>())
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
