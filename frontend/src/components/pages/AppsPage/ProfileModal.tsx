import React, { FormEvent } from 'react'
import { observer } from 'mobx-react'

import Modal from '../../generic/Modal'
import Flex from '../../generic/Flex'
import Input from '../../generic/Input'
import Button from '../../generic/Button'

import styles from '../../../styles/AppsPage.module.sass'

import icons from '../../../util/constants/icons'
import { IUserStore } from '../../../stores/UserStore'
import PictureUpload from '../../generic/PictureUpload'
import { IFileService } from '../../../services/FileService'
import { IUploadService } from '../../../services/UploadService'

interface IEditProfileEvent extends FormEvent<HTMLFormElement> {
	target: EventTarget & {
		elements: {
			name: HTMLInputElement
			email: HTMLInputElement
			picture: HTMLInputElement & {
				files: FileList,
			},
			oldPassword: HTMLInputElement,
			newPassword: HTMLInputElement,
			newPassword2: HTMLInputElement,
		},
	}
}

interface IState {
	pictureSrc: string
	pictureFile: File | null
}

@observer
export default class ProfileModal extends React.Component<{}> {
	public readonly state: IState = {
		pictureSrc: '',
		pictureFile: null,
	}

	@lazyInject(nameof<IUserStore>())
	private readonly userStore: IUserStore

	@lazyInject(nameof<IFileService>())
	private readonly fileService: IFileService

	@lazyInject(nameof<IUploadService>())
	private readonly uploadService: IUploadService

	public render() {
		const { profile } = this.userStore

		return (
			<Modal.CloseTrigger>
				<form onSubmit={this.handleEditProfile} className={styles.newApp}>
					<Flex mt mb>
						<Flex m col list>
							<label>Personal info</label>
							<Input
								name='name'
								label='Name'
								autoComplete='lskmgniegl'
								placeholder={profile.name}
							/>
							<Input
								name='email'
								type='email'
								label='Email'
								autoComplete='trsyrth'
								placeholder={profile.email}
							/>
							<PictureUpload
								label='Upload avatar'
								picture={this.state.pictureSrc || profile.pictureUrl}
								onDrop={this.handleSelectPicture}
							/>
						</Flex>
						<Flex ml mr />
						<Flex m col list className={styles.passwordRow}>
							<label>Change password</label>
							<Input
								name='oldPassword'
								label='Old password'
								type='password'
								autoComplete='retshgrthrshwrt'
							/>
							<Input
								name='newPassword'
								type='password'
								label='New Password'
							/>
							<Input
								name='newPassword2'
								type='password'
								label='Confirm Password'
							/>
							<p>Changing your password will sign you out on all your other devices.</p>
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
							<SVG src={icons.Using} />
							Save
						</Button>
					</footer>
				</form>
			</Modal.CloseTrigger>
		)
	}

	@bind
	private async handleEditProfile(event: IEditProfileEvent) {
		event.preventDefault()

		const {
			name,
			email,
			picture,
			oldPassword,
			newPassword,
			newPassword2,
		} = event.target.elements

		if (newPassword.value !== newPassword2.value) {
			throw new Error('Passwords do not match')
		}

		let downloadUrl
		const avatar = this.state.pictureFile || picture.files[0]

		if (avatar) {
			const upload = await this.uploadService.uploadPicture(avatar)

			await upload.uploadPromise

			downloadUrl = upload.downloadUrl
		}

		await this.userStore.editProfile({
			name: name.value,
			email: email.value,
			oldPassword: oldPassword.value,
			newPassword: newPassword.value,
			pictureUrl: downloadUrl,
		})
	}

	@bind
	private async handleSelectPicture([pictureFile]: File[]) {
		const pictureSrc = await this.fileService.getSourceFromFile(pictureFile)

		this.setState({ pictureSrc, pictureFile })
	}
}
