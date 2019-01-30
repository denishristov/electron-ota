import React, { Component, FormEvent } from 'react'
import Modal from '../../generic/Modal'
import Flex from '../../generic/Flex'
import Input from '../../generic/Input'
import Button from '../../generic/Button'
import Switch from '../../generic/Switch'
import Dropzone from '../../generic/Dropzone'

import { formatFileSize, hashFile, stopEvent, preventClose } from '../../../util/functions'
import axios from 'axios'

import Windows from '../../../img/Windows.svg'
import Apple from '../../../img/Apple.svg'
import Ubuntu from '../../../img/Ubuntu.svg'
import Electron from '../../../img/Electron.svg'

import styles from '../../../styles/AppPage.module.sass'
import inputStyles from '../../../styles/Input.module.sass'

import { IApp } from '../../../stores/App'
import { IVersionModel } from 'shared'
import { observer } from 'mobx-react'

interface IProps {
	app: IApp
}

interface IState {
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

interface ICreateVersionEvent extends FormEvent<HTMLFormElement> {
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

const defaultState: IState = {
	isCritical: false,
	isBase: false,
	isReleasing: false,
	isWindows: true,
	isDarwin: true,
	isLinux: true,
	file: void 0,
}

@observer
export default class CreateVersionModal extends Component<IProps, IState> {
	public readonly state = { ... defaultState }

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
		} = this.state

		return (
			<Modal.Content
				title='Add a new version'
				className={styles.versionModal}
				progress={progress}
			>
				<Modal.CloseTrigger>
					<form onSubmit={this.handleCreateVersion}>
						<Flex>
							<Flex column padding list mr>
								<Input
									name='versionName'
									label='Name'
								/>
								<Flex grow column>
									<label className={inputStyles.label}>Description</label>
									<textarea
										name='description'
										placeholder='Optional description for the update'
									/>
								</Flex>
							</Flex>
							<Flex column padding list ml className={styles.switchRow}>
								<label>Supporting systems</label>
								<Flex centerY className={styles.osRow}>
									<SVG src={Windows} />
									<label className={''}>Windows</label>
									<Switch value={isWindows} onChange={this.toggleIsWindows} />
								</Flex>
								<Flex centerY className={styles.osRow}>
									<SVG src={Apple} />
									<label className={''}>Macos</label>
									<Switch value={isDarwin} onChange={this.toggleIsDarwin}	/>
								</Flex>
								<Flex centerY className={styles.osRow}>
									<SVG src={Ubuntu} />
									<label className={''}>Ubuntu</label>
									<Switch value={isLinux} onChange={this.toggleIsLinux} />
								</Flex>
								<label>Release</label>
								<Flex spread centerY>
									<label className={''}>
										Immediately?
									</label>
									<Switch value={isReleasing} onChange={this.toggleIsReleasing} />
								</Flex>
								<Flex spread centerY>
									<label className={''}>
										Critical?
									</label>
									<Switch value={isCritical} onChange={this.toggleIsCritical} />
								</Flex>
								<Flex spread centerY>
									<label className={''}>
										Base?
									</label>
									<Switch value={isBase} onChange={this.toggleIsBase} />
								</Flex>
								{!isBase && (
									<Dropzone
										onDrop={this.handleDrop}
										name='version'
										accept='.asar'
										messages={uploadMessages}
										className={styles.dropzone}
									>
										{file && (
											<>
												<SVG src={Electron} />
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
							<Button size='small' color='blue' type='submit'>
								ADD
							</Button>
						</footer>
					</form>
				</Modal.CloseTrigger>
			</Modal.Content>
		)
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
	private async handleCreateVersion(event: ICreateVersionEvent) {
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

		if (this.state.isBase) {
			app.emitCreateVersion({
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

			app.emitCreateVersion({
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
