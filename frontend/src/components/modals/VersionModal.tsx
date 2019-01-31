import React, { Component, FormEvent, ChangeEvent } from 'react'
import Modal from '../generic/Modal'
import Flex from '../generic/Flex'
import Input from '../generic/Input'
import Button from '../generic/Button'
import Switch from '../generic/Switch'
import Dropzone from '../generic/Dropzone'

import { formatFileSize, hashFile, preventClose } from '../../util/functions'
import axios from 'axios'

import styles from '../../styles/AppPage.module.sass'
import inputStyles from '../../styles/Input.module.sass'

import { IApp } from '../../stores/App'
import { IVersionModel } from 'shared'
import { observer } from 'mobx-react'
import icons from '../../util/constants/icons'
import { IAppsStore } from '../../stores/AppsStore'

interface IProps {
	app: IApp
	version?: IVersionModel
}

interface IState {
	name: string
	description: string
	isCritical: boolean
	isReleasing: boolean
	isBase: boolean
	isWindows: boolean
	isDarwin: boolean
	isLinux: boolean
	file?: {
		name: string,
		size: number,
		date: Date,
	}
	progress?: number
}

interface IVersionEvent extends FormEvent<HTMLFormElement> {
	target: EventTarget & {
		elements: {
			description: HTMLTextAreaElement
			versionName: HTMLInputElement
			version: HTMLInputElement & {
				files: FileList,
			},
		},
	}
}

const uploadMessages = {
	active: 'Drop here',
	notActive: 'Drop a package or click to upload',
}

@observer
export default class VersionModal extends Component<IProps, IState> {
	constructor(props: IProps) {
		super(props)

		if (this.props.version) {
			const { isCritical, isBase, systems, versionName, description } = this.props.version
			this.state = {
				name: versionName,
				description: description || '',
				isCritical,
				isBase,
				isReleasing: false,
				isWindows: systems.Windows_RT,
				isDarwin: systems.Darwin,
				isLinux: systems.Linux,
			}
		} else {
			this.state = {
				name: '',
				description: '',
				isCritical: false,
				isBase: false,
				isReleasing: false,
				isWindows: true,
				isDarwin: true,
				isLinux: true,
			}
		}
	}

	public componentWillUnmount() {
		removeEventListener('beforeunload', preventClose)
	}

	public render() {
		const {
			isCritical,
			isBase,
			isReleasing,
			isWindows,
			isDarwin,
			isLinux,
			file,
			progress,
			name,
			description,
		} = this.state

		const isEditing = Boolean(this.props.version)

		return (
			<Modal.Content
				title='Add a new version'
				className={styles.versionModal}
				progress={progress}
			>
				<Modal.CloseTrigger>
					<form onSubmit={this.handleSubmit}>
						<Flex grow>
							<Flex column padding list mr>
								<Input
									value={name}
									onChange={this.setName}
									name='versionName'
									label='Name'
								/>
								<Flex grow column>
									<label className={inputStyles.label}>Description</label>
									<textarea
										value={description}
										onChange={this.setDescription}
										name='description'
										placeholder='Optional description for the update'
									/>
								</Flex>
							</Flex>
							<Flex column padding list ml className={styles.switchRow}>
								<label>Supporting systems</label>
								<Flex centerY className={styles.osRow}>
									<SVG src={icons.Windows_RT} />
									<label className={''}>Windows</label>
									<Switch value={isWindows} onChange={this.toggleIsWindows} />
								</Flex>
								<Flex centerY className={styles.osRow}>
									<SVG src={icons.Darwin} />
									<label className={''}>Macos</label>
									<Switch value={isDarwin} onChange={this.toggleIsDarwin}	/>
								</Flex>
								<Flex centerY className={styles.osRow}>
									<SVG src={icons.Linux} />
									<label className={''}>Linux</label>
									<Switch value={isLinux} onChange={this.toggleIsLinux} />
								</Flex>
								<label>Release</label>
								{!isEditing && (
									<Flex spread centerY>
										<label className={''}>
											Immediately?
										</label>
										<Switch value={isReleasing} onChange={this.toggleIsReleasing} />
									</Flex>
								)}
								<Flex spread centerY>
									<label className={''}>
										Critical?
									</label>
									<Switch value={isCritical} onChange={this.toggleIsCritical} />
								</Flex>
								{!isEditing && (
									<Flex spread centerY>
										<label className={''}>
											Base?
										</label>
										<Switch value={isBase} onChange={this.toggleIsBase} />
									</Flex>
								)}
								{!isEditing && !isBase && (
									<Dropzone
										onDrop={this.handleDrop}
										name='version'
										accept='.asar'
										messages={uploadMessages}
										className={styles.dropzone}
									>
										{file && (
											<>
												<SVG src={icons.Electron} />
												<Flex fill>
													<Flex spread centerY>
														<label>{file.name}</label>
													</Flex>
													<Flex spread centerY>
														<label className={''}>
															{formatFileSize(file.size)}
														</label>
														<label className={''}>
															{file.date.toLocaleDateString()}
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
							{isEditing && (
								<Modal.CloseTrigger>
									<Button size='small' color='red' type='button' onClick={this.handleDelete}>
										<SVG src={icons.Delete} />
										Delete
									</Button>
								</Modal.CloseTrigger>
							)}
							{isEditing && (
								<Modal.CloseTrigger>
									<Button size='small' color='green' type='submit'>
										<SVG src={icons.Success} />
										Save
									</Button>
								</Modal.CloseTrigger>
							)}
							{!isEditing && (
								<Button size='small' color='blue' type='submit'>
									<SVG src={icons.Plus} />
									ADD
								</Button>
							)}
						</footer>
					</form>
				</Modal.CloseTrigger>
			</Modal.Content>
		)
	}

	@bind
	private setName(event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({ name: event.target.value })
	}

	@bind
	private setDescription(event: React.ChangeEvent<HTMLTextAreaElement>) {
		this.setState({ description: event.target.value })
	}

	@bind
	private toggleIsCritical() {
		const { isCritical } = this.state
		this.setState({ isCritical: !isCritical })
	}

	@bind
	private toggleIsBase() {
		const { isBase } = this.state
		this.setState({ isBase: !isBase })
	}

	@bind
	private toggleIsWindows() {
		const { isWindows } = this.state
		this.setState({ isWindows: !isWindows })
	}

	@bind
	private toggleIsDarwin() {
		const { isDarwin } = this.state
		this.setState({ isDarwin: !isDarwin })
	}

	@bind
	private toggleIsLinux() {
		const { isLinux } = this.state
		this.setState({ isLinux: !isLinux })
	}

	@bind
	private toggleIsReleasing() {
		const { isReleasing } = this.state
		this.setState({ isReleasing: !isReleasing })
	}

	@bind
	private async handleSubmit(event: IVersionEvent) {
		event.preventDefault()

		const { app } = this.props

		const {
			versionName,
			version,
			description,
		} = event.target.elements

		const {
				isReleasing,
				isCritical,
				isBase,
				isWindows,
				isDarwin,
				isLinux,
			} = this.state

		if (this.props.version) {
			app.updateVersion({
				id: this.props.version.id,
				versionName: versionName.value,
				description: description.value,
				isCritical,
				systems: {
					Windows_RT: isWindows,
					Darwin: isDarwin,
					Linux: isLinux,
				},
			})

			return
		}

		if (this.state.isBase) {
			app.createVersion({
				versionName: versionName.value,
				description: description.value,
				isBase,
				isCritical,
				isReleased: isReleasing,
				systems: {
					Windows_RT: isWindows,
					Darwin: isDarwin,
					Linux: isLinux,
				},
			})
		} else if (version.files) {
			const versionFile = version.files[0]
			const { type } = versionFile

			const {
				downloadUrl,
				signedRequest,
			} = await app.fetchSignedUploadVersionUrl({ name, type })

			const upload = this.uploadVersion(versionFile, signedRequest)

			addEventListener('beforeunload', preventClose)

			const [hash] = await Promise.all([
				hashFile(versionFile),
				upload,
			])

			if (!hash) {
				throw new Error('Error hashing file')
			}

			removeEventListener('beforeunload', preventClose)

			app.createVersion({
				versionName: versionName.value,
				description: description.value,
				downloadUrl,
				hash,
				isBase,
				isCritical,
				isReleased: isReleasing,
				systems: {
					Windows_RT: isWindows,
					Darwin: isDarwin,
					Linux: isLinux,
				},
			})
		}
	}

	private handleReleaseVersion(version: IVersionModel) {
		// this.props.appsStore.emitPublishVersion({
		// 	versionId: version.id,
		// })
	}

	@bind
	private handleDrop([{ name, size, lastModified }]: File[]) {
		this.setState({ file: {
			name,
			size,
			date: new Date(lastModified),
		}})
	}

	@bind
	private handleDelete() {
		if (this.props.version) {
			const { id } = this.props.version
			this.props.app.deleteVersion(id)
		}
	}

	private async uploadVersion(versionFile: File, signedRequest: string) {
		if (this.props.app) {
			const { type } = versionFile

			return axios.put(signedRequest, versionFile, {
				headers: {
					'Content-Type': type,
				},
				onUploadProgress: ({ loaded, total }) => {
					const progress = Math.round((loaded * 100) / total)
					this.setState({ progress })
				},
			})
		}
	}
}
