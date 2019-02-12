import React, { Component, FormEvent, ChangeEvent } from 'react'
import Modal from '../generic/Modal'
import Flex from '../generic/Flex'
import Input from '../generic/Input'
import Button from '../generic/Button'
import Switch from '../generic/Switch'
import Dropzone from '../generic/Dropzone'

import { formatFileSize, hashFile, preventClose, list, formatDate } from '../../util/functions'
import axios from 'axios'

import styles from '../../styles/VersionModal.module.sass'
import utilStyles from '../../styles/util.module.sass'

import { IApp } from '../../stores/App'
import { VersionModel } from 'shared'
import { observer } from 'mobx-react'
import icons from '../../util/constants/icons'

import Pushable from '../generic/Pushable'
import semver from 'semver'

enum ReleaseType {
	Major = 'Major',
	Minor = 'Minor',
	Patch = 'Patch',
	Custom = 'Custom',
}

interface IProps {
	app: IApp
	version?: VersionModel
	previousVersionName?: string | null
	toggleClosing?: () => void
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
	releaseType?: ReleaseType
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

enum Toggle {
	isCritical = 'isCritical',
	isReleasing = 'isReleasing',
	isBase = 'isBase',
	isWindows = 'isWindows',
	isDarwin = 'isDarwin',
	isLinux = 'isLinux',
}

const CancelToken = axios.CancelToken

@observer
export default class VersionModal extends Component<IProps, IState> {
	private readonly cancelTokenSource = CancelToken.source()

	private readonly releaseTypeSetters = Object.keys(ReleaseType)
		.group((name) => [name, this.setReleaseType.bind(this, name as ReleaseType)])

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
				name: props.previousVersionName
					? semver.inc(props.previousVersionName, 'patch') || ''
					: '',
				description: '',
				isCritical: false,
				isBase: false,
				isReleasing: false,
				isWindows: true,
				isDarwin: true,
				isLinux: true,
				releaseType: props.previousVersionName ? ReleaseType.Patch : ReleaseType.Custom,
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
			releaseType,
		} = this.state

		const isEditing = Boolean(this.props.version)
		const isUploading = progress !== void 0

		return (
			<Modal.CloseTrigger>
				<form onSubmit={this.handleSubmit}>
					<Flex grow>
						<Flex col p list mr>
							<Input
								value={name}
								onChange={this.setName}
								name='versionName'
								label='Name'
								disabled={!isEditing && releaseType !== ReleaseType.Custom}
							/>
							{this.props.previousVersionName && (
								<>
									<label>Release type</label>
									<Flex list fill className={styles.releaseTypes}>
										{Object.keys(ReleaseType).map((name) => (
											<Pushable key={name}>
												<div
													className={list(
														styles.releaseButton,
														releaseType === name && styles.releaseButtonSelected,
													)}
													onClick={this.releaseTypeSetters[name]}
												>
													{name}
												</div>
											</Pushable>
										))}
									</Flex>
								</>
							)}
							<Flex grow col>
								<label className={styles.label}>Description</label>
								<textarea
									value={description}
									onChange={this.setDescription}
									name='description'
									placeholder='Optional description for the update'
								/>
							</Flex>
						</Flex>
						<Flex col p list ml className={styles.switchRow}>
							<label>Supporting systems</label>
							<Flex y className={styles.osRow}>
								<SVG src={icons.Windows_RT} />
								<label className={utilStyles.dark}>Windows</label>
								<Switch value={isWindows} onChange={this.toggleIsWindows} />
							</Flex>
							<Flex y className={styles.osRow}>
								<SVG src={icons.Darwin} />
								<label className={utilStyles.dark}>Macos</label>
								<Switch value={isDarwin} onChange={this.toggleIsDarwin}	/>
							</Flex>
							<Flex y className={styles.osRow}>
								<SVG src={icons.Linux} />
								<label className={utilStyles.dark}>Linux</label>
								<Switch value={isLinux} onChange={this.toggleIsLinux} />
							</Flex>
							<label>Release</label>
							{!isEditing && (
								<Flex spread y>
									<label className={utilStyles.dark}>
										Immediately?
									</label>
									<Switch value={isReleasing} onChange={this.toggleIsReleasing} />
								</Flex>
							)}
							<Flex spread y>
								<label className={utilStyles.dark}>
									Critical?
								</label>
								<Switch value={isCritical} onChange={this.toggleIsCritical} />
							</Flex>
							{!isEditing && (
								<Flex spread y>
									<label className={utilStyles.dark}>
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
											<Flex fill col grow>
												<Flex y ml>
													<label>{file.name}</label>
												</Flex>
												<Flex spread y ml grow>
													<label className={utilStyles.dark}>
														{formatFileSize(file.size)}
													</label>
													<label className={utilStyles.dark}>
														{formatDate(file.date)}
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
						{isUploading && (
							<Flex grow mt y>
								<label>{`${progress}%`}</label>
								<Flex grow ml className={styles.progressContainer}>
									<div className={styles.progress} style={{ width: `${progress}%` }} />
								</Flex>
							</Flex>
						)}
						{!isUploading && (
							<Modal.CloseTrigger>
								<Button size='small' color='white' type='button'>
									<SVG src={icons.Close} />
									Cancel
								</Button>
							</Modal.CloseTrigger>
						)}
						{isEditing
							? (
								<>
									<Modal.CloseTrigger>
										<Button size='small' color='red' type='button' onClick={this.handleDelete}>
											<SVG src={icons.Delete} />
											Delete
										</Button>
									</Modal.CloseTrigger>
									<Button size='small' color='green' type='submit'>
										<SVG src={icons.Success} />
										Save
									</Button>
								</>
							)
							: isUploading
								? (
									<Modal.CloseTrigger>
										<Button size='small' color='red' type='button' onClick={this.handleCancel}>
											<SVG src={icons.Close} />
											Cancel
										</Button>
									</Modal.CloseTrigger>
								)
								: (
									<Button size='small' color='blue' type='submit'>
										<SVG src={icons.Plus} />
										Add
									</Button>
								)
						}
					</footer>
				</form>
			</Modal.CloseTrigger>
		)
	}

	@bind
	private handleCancel() {
		this.props.toggleClosing && this.props.toggleClosing()
		this.cancelTokenSource.cancel()
	}

	@bind
	private setReleaseType(releaseType: ReleaseType) {
		if (releaseType !== ReleaseType.Custom && this.props.previousVersionName) {
			const type = releaseType.toLowerCase() as semver.ReleaseType
			const name = semver.inc(this.props.previousVersionName, type)
			name && this.setState({ name })
		}

		this.setState({ releaseType })
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

		const { app, toggleClosing } = this.props

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
				systems: {
					Windows_RT: isWindows,
					Darwin: isDarwin,
					Linux: isLinux,
				},
			})
		} else if (version.files) {
			// console.log(version.files)
			const versionFile = version.files[0]
			const { type } = versionFile
			const name = `${this.props.app.bundleId}-${versionName.value}-${Date.now()}.asar`

			const {
				downloadUrl,
				signedRequest,
			} = await app.fetchSignedUploadVersionUrl({ name, type })

			const upload = this.uploadVersion(versionFile, signedRequest)

			addEventListener('beforeunload', preventClose)
			toggleClosing && toggleClosing()

			const [hash] = await Promise.all([
				hashFile(versionFile),
				upload,
			])

			if (!hash) {
				throw new Error('Error hashing file')
			}

			removeEventListener('beforeunload', preventClose)
			toggleClosing && toggleClosing()

			app.createVersion({
				versionName: versionName.value,
				description: description.value,
				downloadUrl,
				hash,
				isBase,
				isCritical,
				systems: {
					Windows_RT: isWindows,
					Darwin: isDarwin,
					Linux: isLinux,
				},
			})
		}
	}

	private handleReleaseVersion(version: VersionModel) {
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
				cancelToken: this.cancelTokenSource.token,
			})
		}
	}
}
