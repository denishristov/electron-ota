import React, { FormEvent } from 'react'
import { observer } from 'mobx-react'

import Modal from '../generic/Modal'
import Flex from '../generic/Flex'
import Input from '../generic/Input'
import Button from '../generic/Button'

import styles from '../../styles/AppsPage.module.sass'

import { IAppsStore } from '../../stores/AppsStore'
import { getSourceFromFile, filterBoolean } from '../../util/functions'

import axios from 'axios'
import icons from '../../util/constants/icons'
import { IUserStore } from '../../stores/UserStore'
import PictureUpload from '../generic/PictureUpload'
import { IApi } from '../../util/Api'
import { EventType, SignUploadUrlResponse } from 'shared'

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

@observer
export default class ProfileModal extends React.Component<{}> {
	public readonly state = {
		pictureSrc: '',
	}

	@DI.lazyInject(DI.Api)
	private readonly api: IApi

	@DI.lazyInject(DI.Stores.User)
	private readonly userStore: IUserStore

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
								placeholder={profile.name}
							/>
							<Input
								name='email'
								type='email'
								label='Email'
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
							<p>Changing your password will remove all saved authentication tokens.</p>
						</Flex>
					</Flex>
					<footer>
						<Modal.CloseTrigger>
							<Button size='small' color='white' type='button'>
								<SVG src={icons.Close} />
								Cancel
							</Button>
						</Modal.CloseTrigger>
						<Button size='small' color='red' type='button' onClick={this.deleteProfile}>
							<SVG src={icons.Delete} />
							Delete Profile
						</Button>
						<Button size='small' color='blue' type='submit'>
							<SVG src={icons.Edit} />
							Submit
						</Button>
					</footer>
				</form>
			</Modal.CloseTrigger>
		)
	}

	@bind
	private async deleteProfile() {
		await this.api.emit(EventType.DeleteProfile)
		this.userStore.logout()
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

		const pictureFile = picture.files[0]
		const { name: pictureName, type } = pictureFile

		if (newPassword.value !== newPassword2.value) {
			throw new Error('Passwords do not match')
		}

		const {
			downloadUrl,
			signedRequest,
		} = await this.api.emit<SignUploadUrlResponse>(EventType.SignUploadPictureUrl , { name: pictureName, type })

		await axios.put(signedRequest, pictureFile, {
			headers: {
				'Content-Type': pictureFile.type,
			},
		})

		await this.api.emit(EventType.EditProfile, {
			name: name.value,
			email: email.value,
			oldPassword: oldPassword.value,
			newPassword: newPassword.value,
			pictureUrl: downloadUrl,
		})

		Object.assign(this.userStore.profile, filterBoolean({
			name: name.value,
			email: email.value,
			pictureUrl: downloadUrl,
		}))
	}

	@bind
	private async handleSelectPicture([pictureFile]: File[]) {
		const pictureSrc = await getSourceFromFile(pictureFile)
		this.setState({ pictureSrc })
	}
}
