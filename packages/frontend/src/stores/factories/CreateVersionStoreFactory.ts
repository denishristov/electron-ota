import { interfaces } from 'inversify'
import { AppModel } from 'shared'
import { IApp } from '../../stores/App'
import { ICreateVersionStore } from '../CreateVersionStore'
import CreateVersionStore from '../CreateVersionStore'
import { IFileService } from '../../services/FileService'
import { IUploadService } from '../../services/UploadService'

export type CreateVersionStoreFactory = (app: IApp, previousVersionName: string | null) => ICreateVersionStore

export default function createVersionStoreFactory({ container }: interfaces.Context): CreateVersionStoreFactory {
	const fileService = container.get<IFileService>(DI.Services.File)
	const uploadService = container.get<IUploadService>(DI.Services.Upload)

	return (app: IApp, previousVersionName: string | null) => {
		return new CreateVersionStore(fileService, uploadService, app, previousVersionName)
	}
}
