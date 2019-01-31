import React, { FormEvent } from 'react'
import { observer } from 'mobx-react'

import Modal from '../generic/Modal'
import Flex from '../generic/Flex'
import Input from '../generic/Input'
import Button from '../generic/Button'
import Dropzone from '../generic/Dropzone'

import styles from '../../styles/AppsPage.module.sass'

import { IAppsStore } from '../../stores/AppsStore'
import { getSourceFromFile } from '../../util/functions'

import axios from 'axios'
import icons from '../../util/constants/icons'

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
	private readonly appsStore!: IAppsStore

	public render() {
		return (
			<Modal.CloseTrigger>
				<form onSubmit={this.handleCreateApp} className={styles.newApp}>
					<Flex fill>
						<Flex margin column centerY>
							<label className={styles.uploadLabel}>Upload Icon</label>
							<Dropzone
								onDrop={this.handleSelectPicture}
								name='picture'
								accept='image/*'
								className={styles.dropzone}
							>
								{this.state.pictureSrc
									? <img src={this.state.pictureSrc} className={styles.uploadIcon} />
									: <SVG src={icons.Camera} className={styles.uploadIcon} />
								}
							</Dropzone>
						</Flex>
						<Flex margin column list>
							<Input name='name' label='Name' />
							<Input name='bundleId' label='Bundle ID' />
						</Flex>
					</Flex>
					<footer>
						<Button size='small' color='blue' type='submit'>
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
		const { name: pictureName, type } = pictureFile

		const {
			downloadUrl,
			signedRequest,
		} = await this.appsStore.fetchUploadPictureUrl({ name: pictureName, type })

		await axios.put(signedRequest, pictureFile, {
			headers: {
				'Content-Type': pictureFile.type,
			},
		})

		this.appsStore.emitCreateApp({
			bundleId: bundleId.value,
			name: name.value,
			pictureUrl: downloadUrl,
		})
	}

	@bind
	private async handleSelectPicture([pictureFile]: File[]) {
		const pictureSrc = await getSourceFromFile(pictureFile)
		this.setState({ pictureSrc })
	}
}
