import { interfaces } from 'inversify'
import { IApp } from '../App'
import { IFileService } from '../../services/FileService'
import { IUploadService } from '../../services/UploadService'
import { VersionModel } from 'shared/src/schemas/Version'
import UpdateVersionStore, { IUpdateVersionStore } from '../UpdateVersionStore'

export type UpdateVersionStoreFactory = (app: IApp, version: VersionModel) => IUpdateVersionStore

export default function updateVersionStoreFactory({ container }: interfaces.Context): UpdateVersionStoreFactory {
	const fileService = container.get<IFileService>(DI.Services.File)
	const uploadService = container.get<IUploadService>(DI.Services.Upload)

	return (app: IApp, version: VersionModel) => {
		return new UpdateVersionStore(fileService, uploadService, app, version)
	}
}
