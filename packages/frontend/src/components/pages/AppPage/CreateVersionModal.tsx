import React, { Component, FormEvent, ChangeEvent } from 'react'
import Modal from '../../generic/Modal'
import Flex from '../../generic/Flex'
import Input from '../../generic/Input'
import Button from '../../generic/Button'
import Dropzone from '../../generic/Dropzone'

import { formatFileSize, preventClose, list, formatDate } from '../../../util/functions'

import styles from '../../../styles/VersionModal.module.sass'
import utilStyles from '../../../styles/util.module.sass'

import { observer } from 'mobx-react'
import icons from '../../../util/constants/icons'

import Pushable from '../../generic/Pushable'
import { ReleaseType, ToggleNames } from '../../../util/enums'
import { ICreateVersionStore } from '../../../stores/CreateVersionStore'
import ToggleRow from '../../generic/ToggleRow'

import { messages } from '../../../util/constants/defaults'

const uploadMessages = {
	active: 'Drop here',
	notActive: 'Drop a package or click to upload',
}

interface IProps {
	store: ICreateVersionStore
	toggleClosing: () => void
}

interface ICreateEvent extends FormEvent<HTMLFormElement> {
	target: EventTarget & {
		elements: {
			description: HTMLTextAreaElement
			versionName: HTMLInputElement
			password: HTMLInputElement
			version: HTMLInputElement & {
				files: FileList,
			},
		},
	}
}

@observer
export default class CreateVersionModal extends Component<IProps> {
	private readonly store = this.props.store

	public componentWillUnmount() {
		removeEventListener('beforeunload', preventClose)
	}

	public render() {
		const {
			previousVersionName,
			isUploading,
			releaseTypeSetters,
			versionModalStore,
			handleDrop,
		} = this.store

		const { toggles } = versionModalStore

		return (
			<Modal.CloseTrigger>
				<form onSubmit={this.handleSubmit}>
					<Flex grow>
						<Flex col p list mr>
							<Input
								value={versionModalStore.versionName}
								onChange={this.setVersionName}
								name='versionName'
								label='Name'
								required
								disabled={this.store.releaseType !== ReleaseType.Custom}
							/>
							{previousVersionName && (
								<>
									<label>Release type</label>
									<Flex list fill className={styles.releaseTypes}>
										{Object.values(ReleaseType).map((name) => (
											<Pushable key={name}>
												<Flex
													x
													y
													className={list(
														styles.releaseButton,
														this.store.releaseType === name
															&& styles.releaseButtonSelected,
													)}
													onClick={releaseTypeSetters[name]}
												>
													{name}
												</Flex>
											</Pushable>
										))}
									</Flex>
								</>
							)}
							<Flex grow col>
								<label className={styles.label}>Description</label>
								<textarea
									name='description'
									placeholder='Optional description for the update'
								/>
							</Flex>
						</Flex>
						<Flex col p list ml className={styles.switchRow}>
							<label>Supporting systems</label>
							<ToggleRow
								label='macOS'
								icon={icons.Darwin}
								onChange={toggles[ToggleNames.isDarwin]}
								value={versionModalStore.isDarwin}
							/>
							<ToggleRow
								label='Linux'
								icon={icons.Linux}
								onChange={toggles[ToggleNames.isLinux]}
								value={versionModalStore.isLinux}
							/>
							<ToggleRow
								label='Windows'
								icon={icons.Windows_RT}
								onChange={toggles[ToggleNames.isWindows]}
								value={versionModalStore.isWindows}
							/>
							<label>Release Options</label>
							<ToggleRow
								spread
								label='Critical'
								onChange={toggles[ToggleNames.isCritical]}
								value={versionModalStore.isCritical}
								color='red'
								message={messages.critical}
							/>
							<ToggleRow
								spread
								label='Base'
								onChange={toggles[ToggleNames.isBase]}
								value={versionModalStore.isBase}
								color='orange'
								message={messages.base}
							/>
							<ToggleRow
								spread
								label='Immediately'
								onChange={toggles[ToggleNames.isReleasing]}
								value={versionModalStore.isReleasing}
								color='green'
								message={messages.immediately}
							/>
							{versionModalStore.isReleasing && (
								<Input
									label='password'
									name='password'
									type='password'
									required={versionModalStore.isReleasing}
								/>
							)}
							{!versionModalStore.isBase && (
								<Dropzone
									onDrop={handleDrop}
									name='version'
									accept='.asar'
									messages={uploadMessages}
									className={styles.dropzone}
									required
								>
									{this.store.versionFile && (
										<>
											<SVG src={icons.Electron} />
											<Flex fill col grow>
												<Flex y ml>
													<label>{this.store.versionFile.name}</label>
												</Flex>
												<Flex spread y ml grow>
													<label className={utilStyles.dark}>
														{formatFileSize(this.store.versionFile.size)}
													</label>
													<label className={utilStyles.dark}>
														{formatDate(new Date(this.store.versionFile.lastModified))}
													</label>
												</Flex>
											</Flex>
										</>
									)}
								</Dropzone>
							)}
						</Flex>
					</Flex>
					<footer>
						{isUploading
							? (
								<>
									<Flex grow mt y className={styles.loadingContainer}>
										<label>{`${this.store.progress}%`}</label>
										<Flex grow className={styles.progressContainer}>
											<div className={styles.progress} style={{ width: `${this.store.progress}%` }} />
										</Flex>
									</Flex>
									<Modal.CloseTrigger>
										<Button size='small' color='red' type='button' onClick={this.handleCancel}>
											<SVG src={icons.Close} />
											Cancel
										</Button>
									</Modal.CloseTrigger>
								</>
							)
							: (
								<>
									<Modal.CloseTrigger>
										<Button size='small' color='white' type='button'>
											<SVG src={icons.Close} />
											Cancel
										</Button>
									</Modal.CloseTrigger>
									<Button
										size='small'
										color='blue'
										type='submit'
										disabled={!this.store.isValid}
									>
										<SVG src={icons.Plus} />
										Add
									</Button>
								</>
							)}
					</footer>
				</form>
			</Modal.CloseTrigger>
		)
	}

	@bind
	private setVersionName(event: ChangeEvent<HTMLInputElement>) {
		this.store.versionModalStore.versionName = event.target.value
	}

	@bind
	private handleCancel() {
		const { store, toggleClosing } = this.props

		toggleClosing()
		store.cancelTokenSource && store.cancelTokenSource.cancel()
	}

	@bind
	private async handleSubmit(event: ICreateEvent) {
		event.preventDefault()

		const { toggleClosing } = this.props

		const {
			versionName,
			description,
			password,
		} = event.target.elements

		addEventListener('beforeunload', preventClose)
		toggleClosing()

		await this.store.handleCreate({
			versionName: versionName.value,
			description: description.value,
			password: password && password.value,
		})

		removeEventListener('beforeunload', preventClose)
		toggleClosing()
	}
}
