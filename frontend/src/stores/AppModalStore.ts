import { observable, action } from 'mobx'
import { colors } from '../util/constants/styles'
import { IFileService } from '../services/FileService'

export interface IAppModalStore {
	color: string
	pictureSrc?: string
	picture?: File
	colorSetters: { [x: string]: () => void }
	handleSelectPicture([pictureFile]: File[]): Promise<void>
}

@injectable()
export default class AppModalStore implements IAppModalStore {
	@observable
	public color = colors.ui.accent

	@observable
	public pictureSrc?: string

	public readonly colorSetters = Object.values(colors.data)
		.group((color) => [color, action(() => {
			this.color = color
		})])

	public picture?: File

	constructor(
		@inject(nameof<IFileService>())
		private readonly fileService: IFileService,
	) { }

	@transformToMobxFlow
	@bind
	public async handleSelectPicture([pictureFile]: File[]) {
		this.picture = pictureFile
		this.pictureSrc = await this.fileService.getSourceFromFile(pictureFile) || void 0
	}
}
