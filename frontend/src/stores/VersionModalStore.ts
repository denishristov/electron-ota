import { observable, action } from 'mobx'
import { ToggleNames } from '../util/enums'

export interface IVersionFormData {
	versionName: string
	description: string
	password?: string
}

type Toggle = () => void

type Toggles = {
	[name in ToggleNames]: boolean
}

export interface IVersionModalStore extends Toggles {
	versionName: string
	toggles: {
		[toggleName: string]: Toggle,
	}
}

@injectable()
export default class VersionModalStore implements IVersionModalStore {
	@observable
	public versionName: string = ''

	@observable
	public isCritical: boolean = false

	@observable
	public isReleasing: boolean = false

	@observable
	public isBase: boolean = false

	@observable
	public isWindows: boolean = true

	@observable
	public isDarwin: boolean = true

	@observable
	public isLinux: boolean = true

	public readonly toggles = Object.keys(ToggleNames)
		.group((name) => [name, action(() => this[name] = !this[name])])
}
