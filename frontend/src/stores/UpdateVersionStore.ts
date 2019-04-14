import { IVersionFormData } from './VersionModalStore'
import { IApp } from './App'
import { VersionModel } from 'shared'
import { action, observable } from 'mobx'
import { IVersionModalStore } from './VersionModalStore'

export interface IUpdateVersionStore  {
	description?: string
	versionModalStore: IVersionModalStore
	handleUpdate({
		versionName,
		description,
	}: IVersionFormData): Promise<void>
}

export default class UpdateVersionStore implements IUpdateVersionStore {
	@observable
	public description?: string

	constructor(
		private readonly app: IApp,
		private readonly version: VersionModel,
		public readonly versionModalStore: IVersionModalStore,
	) {
		const { versionName, description, isCritical, systems } = version

		this.versionModalStore.versionName = versionName
		this.versionModalStore.isCritical = isCritical
		this.versionModalStore.isDarwin = systems.Darwin
		this.versionModalStore.isWindows = systems.Windows_NT
		this.versionModalStore.isLinux = systems.Linux
		this.description = description
	}

	@transformToMobxFlow
	@bind
	public async handleUpdate({
		versionName,
		description,
	}: IVersionFormData) {

		const {
			isCritical,
			isWindows,
			isDarwin,
			isLinux,
		} = this.versionModalStore

		this.app.updateVersion({
			id: this.version.id,
			versionName,
			description,
			isCritical,
			systems: {
				Windows_NT: isWindows,
				Darwin: isDarwin,
				Linux: isLinux,
			},
		})
	}
}
