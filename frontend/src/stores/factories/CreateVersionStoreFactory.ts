import { interfaces } from 'inversify'
import { IApp } from '../../stores/App'
import { ICreateVersionStore } from '../CreateVersionStore'
import CreateVersionStore from '../CreateVersionStore'
import { IFileService } from '../../services/FileService'
import { IUploadService } from '../../services/UploadService'
import { IVersionModalStore } from '../VersionModalStore'

export type CreateVersionStoreFactory = (app: IApp, previousVersionName: string | null) => ICreateVersionStore

export default function createVersionStoreFactory({ container }: interfaces.Context): CreateVersionStoreFactory {
	const fileService = container.get<IFileService>(nameof<IFileService>())
	const uploadService = container.get<IUploadService>(nameof<IUploadService>())

	return (app: IApp, previousVersionName: string | null) => {
		const versionModal = container.get<IVersionModalStore>(nameof<IVersionModalStore>())

		return new CreateVersionStore(
			fileService,
			uploadService,
			app,
			versionModal,
			previousVersionName,
		)
	}
}
