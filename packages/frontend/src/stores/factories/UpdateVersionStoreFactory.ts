import { interfaces } from 'inversify'
import { IApp } from '../App'
import { VersionModel } from 'shared'
import UpdateVersionStore, { IUpdateVersionStore } from '../UpdateVersionStore'
import { IVersionModalStore } from '../VersionModalStore';

export type UpdateVersionStoreFactory = (app: IApp, version: VersionModel) => IUpdateVersionStore

export default function updateVersionStoreFactory({ container }: interfaces.Context): UpdateVersionStoreFactory {
	const versionModal = container.get<IVersionModalStore>(DI.Stores.VersionModal)

	return (app: IApp, version: VersionModel) => {
		return new UpdateVersionStore(app, version, versionModal)
	}
}
