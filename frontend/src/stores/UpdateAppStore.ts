import { IAppModalStore } from './AppModalStore'
import { IAppsStore } from './AppsStore'
import { IUploadService } from '../services/UploadService'

interface IFormData {
	id: string
	name?: string
}

export interface IUpdateAppStore {
	appModalStore: IAppModalStore
	handleEdit(data: IFormData): Promise<void>
}

@injectable()
export default class UpdateAppStore implements IUpdateAppStore {
	constructor(
		@inject(nameof<IAppsStore>())
		private readonly appsStore: IAppsStore,
		@inject(nameof<IUploadService>())
		private readonly uploadService: IUploadService,
		@inject(nameof<IAppModalStore>())
		public readonly appModalStore: IAppModalStore,
	) {}

	@bind
	public async handleEdit({ name, id }: IFormData) {
		let pictureUrl

		const { picture, color } = this.appModalStore

		if (picture) {
			const upload = await this.uploadService.uploadPicture(picture)

			await upload.uploadPromise

			pictureUrl = upload.downloadUrl
		}

		await this.appsStore.updateApp({
			id,
			name,
			pictureUrl,
			color,
		})
	}
}
