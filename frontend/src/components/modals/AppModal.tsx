import React, { FormEvent } from 'react'
import { observer } from 'mobx-react'

import Modal from '../generic/Modal'
import Flex from '../generic/Flex'
import Input from '../generic/Input'
import Button from '../generic/Button'

import styles from '../../styles/AppsPage.module.sass'

import { IAppsStore } from '../../stores/AppsStore'

import icons from '../../util/constants/icons'
import PictureUpload from '../generic/PictureUpload'
import { IFileService } from '../../services/FileService'
import { IUploadService } from '../../services/UploadService'

interface ICreateAppEvent extends FormEvent<HTMLFormElement> {
	target: EventTarget & {
		elements: {
			name: HTMLInputElement
			bundleId: HTMLInputElement
			picture: HTMLInputElement & {
				files: FileList,
			},
		},
	}
}

interface ICreateAppEvent extends FormEvent<HTMLFormElement> {
	target: EventTarget & {
		elements: {
			name: HTMLInputElement
			bundleId: HTMLInputElement
			picture: HTMLInputElement & {
				files: FileList,
			},
		},
	}
}

interface IState {
	pictureSrc: string | null
}

@observer
export default class AppModal extends React.Component<{}, IState> {
	public readonly state = {
		pictureSrc: '',
	}

	@DI.lazyInject(DI.Stores.Apps)
	private readonly appsStore: IAppsStore

	@DI.lazyInject(DI.Services.File)
	private readonly fileService: IFileService

	@DI.lazyInject(DI.Services.Upload)
	private readonly uploadService: IUploadService

	public render() {
		return (
			<Modal.CloseTrigger>
				<form onSubmit={this.handleCreateApp} className={styles.newApp}>
					<Flex fill mt mb>
						<Flex m col y className={styles.pictureContainer}>
							<PictureUpload
								label='Upload icon'
								picture={this.state.pictureSrc}
								onDrop={this.handleSelectPicture}
							/>
						</Flex>
						<Flex ml mr />
						<Flex m col list>
							<Input name='name' label='Name' required />
							<Input name='bundleId' label='Bundle ID' required />
						</Flex>
					</Flex>
					<footer>
						<Modal.CloseTrigger>
							<Button size='small' color='white' type='button'>
							<SVG src={icons.Close} />
								Cancel
							</Button>
						</Modal.CloseTrigger>
						<Button size='small' color='blue' type='submit'>
							<SVG src={icons.Plus} />
							Add
						</Button>
					</footer>
				</form>
			</Modal.CloseTrigger>
		)
	}

	@bind
	private async handleCreateApp(event: ICreateAppEvent) {
		event.preventDefault()

		const { name, picture, bundleId } = event.target.elements

		const pictureFile = picture.files[0]
		let downloadUrl

		if (pictureFile) {
			const upload = await this.uploadService.uploadPicture(pictureFile)

			downloadUrl = upload.downloadUrl
		}

		this.appsStore.createApp({
			bundleId: bundleId.value,
			name: name.value,
			pictureUrl: downloadUrl,
		})
	}

	@bind
	private async handleSelectPicture([pictureFile]: File[]) {
		const pictureSrc = await this.fileService.getSourceFromFile(pictureFile)
		this.setState({ pictureSrc })
	}
}
