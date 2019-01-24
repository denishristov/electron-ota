import { computed } from 'mobx'
import { inject, observer } from 'mobx-react'
import React, { Component, FormEvent } from 'react'
import { Redirect, RouteComponentProps } from 'react-router'
import axios from 'axios'

import App from '../../stores/App'
import AppsStore from '../../stores/AppsStore'
import { hashBlob, formatFileSize, downloadFile, list } from '../../util/functions'
import { injectAppsStore } from '../../stores/RootStore'
import { IVersionModel } from 'shared'
import Version from './Version'

import Modal from '../Generic/Modal'
import Input from '../Generic/Input'
import Button from '../Generic/Button'
import Container from '../Generic/Container'
import Switch from '../Generic/Switch'
import Flex from '../Generic/Flex'
import Dropzone from '../Generic/Dropzone'
import AppearAnimation from '../Generic/AppearAnimation'

import Plus from '../../img/Plus.svg'
import Windows from '../../img/Windows.svg'
import Apple from '../../img/Apple.svg'
import Ubuntu from '../../img/Ubuntu.svg'
import Electron from '../../img/Electron.svg'

import appsPageStyles from '../../styles/AppsPage.module.sass'
import styles from '../../styles/AppPage.module.sass'
import indexStyles from '../../index.module.sass'

import Loading from '../Generic/Loading'

interface IParams {
	id: string
}

interface IProps extends RouteComponentProps<IParams> {
	appsStore: AppsStore
	style: object
}

interface IState {
	hasLoaded: boolean
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
	hasLoaded: false,
	isCritical: false,
	isBase: false,
	isReleasing: false,
	isWindows: true,
	isDarwin: true,
	isLinux: true,
	file: void 0,
}

class AppPage extends Component<IProps, IState> {
	public readonly state = { ... defaultState }

	private readonly modalRef = React.createRef<Modal>()

	@computed
	private get app(): App | null {
		return this.props.appsStore.getApp(this.props.match.params.id) || null
	}

	public async componentDidMount() {
		if (!this.props.appsStore.allApps.length) {
			await this.props.appsStore.fetchApps()
		}

		if (this.app) {
			this.app.fetchVersions()
			this.app.fetchSimpleReports()
		}

		this.setState({ hasLoaded: true })
	}

	public render() {
		if (!this.state.hasLoaded) {
			return <Loading />
		}

		if (!this.app) {
			return <Redirect to='/apps' />
		}

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

		const {
			name,
			allVersions,
			simpleReports,
		} = this.app

		return (
			<Container style={this.props.style}>
				<div className={appsPageStyles.appsPageContainer}>
					<header>
						<h1>{name}</h1>
						<Button color='blue' noShadow size='small' onClick={this.openModal}>
							<SVG src={Plus} />
							Add new version
						</Button>
					</header>
					<div className={styles.versionContainer}>
						<AppearAnimation items={allVersions}>
							{(version) => (animation) => (
								<Version
									simpleReports={simpleReports}
									version={version}
									animation={animation}
								/>
							)}
						</AppearAnimation>
					</div>
				</div>
				<Modal
					title='Add a new version'
					className={styles.versionModal}
					progress={progress}
					ref={this.modalRef}
				>
					<form onSubmit={this.handleCreateVersion}>
						<Flex>
							<Flex column margin list>
								<Input
									type='text'
									name='versionName'
									label='Name'
								/>
								<label>Description</label>
								<textarea placeholder='Optional description for the update' />
							</Flex>
							<Flex column margin list>
								<label>Supporting systems</label>
								<Flex centerY className={styles.osRow}>
									<SVG src={Windows} />
									<label className={indexStyles.light}>Windows</label>
									<Switch value={isWindows} onChange={this.toggleIsWindows} />
								</Flex>
								<Flex centerY className={styles.osRow}>
									<SVG src={Apple} />
									<label className={indexStyles.light}>Macos</label>
									<Switch value={isDarwin} onChange={this.toggleIsDarwin}	/>
								</Flex>
								<Flex centerY className={styles.osRow}>
									<SVG src={Ubuntu} />
									<label className={indexStyles.light}>Ubuntu</label>
									<Switch value={isLinux} onChange={this.toggleIsLinux} />
								</Flex>
								<label>Release</label>
								<Flex spread centerY>
									<label className={indexStyles.light}>
										Immediately?
									</label>
									<Switch value={isReleasing} onChange={this.toggleIsReleasing} />
								</Flex>
								<Flex spread centerY>
									<label className={indexStyles.light}>
										Critical?
									</label>
									<Switch value={isCritical} onChange={this.toggleIsCritical} />
								</Flex>
								<Flex spread centerY>
									<label className={indexStyles.light}>
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
									>
									{file && (
										<>
											<SVG src={Electron} />
											<Flex expand>
												<Flex spread centerY>
													<label className='text-overflow'>{file.name}</label>
												</Flex>
												<Flex spread centerY>
													<label className={indexStyles.light}>
														{formatFileSize(file.size)}
													</label>
													<label className={indexStyles.light}>
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
							<Button size='small' color='blue' noShadow type='submit'>
								ADD
							</Button>
						</footer>
					</form>
				</Modal>
			</Container>
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

		const {
			versionName,
			version,
		} = event.target.elements

		if (this.app) {
			const {
				isCritical,
				isBase,
				isWindows,
				isDarwin,
				isLinux,
			} = this.state

			if (this.state.isBase) {
				this.app.emitCreateVersion({
					versionName: versionName.value,
					isBase,
					isCritical,
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
				} = await this.app.fetchSignedUploadVersionUrl({ name, type })

				const upload = this.uploadVersion(versionFile, signedRequest)

				const [hash] = await Promise.all([
					hashBlob(versionFile),
					upload,
				])

				this.app.emitCreateVersion({
					versionName: versionName.value,
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

			this.closeModal()
			this.setState({ ...defaultState, hasLoaded: true })
		}
	}

	@bind
	private openModal() {
		const { current } = this.modalRef
		current && current.open()
	}

	private closeModal() {
		const { current } = this.modalRef
		current && current.close()
	}

	private handleReleaseVersion(version: IVersionModel) {
		this.props.appsStore.emitPublishVersion({
			versionId: version.id,
		})
	}

	@bind
	private handleDrop(files: File[]) {
		const [{ name, size, lastModified }] = files

		this.setState({ file: {
			name,
			size,
			date: new Date(lastModified),
		}})
	}

	private async uploadVersion(versionFile: File, signedRequest: string) {
		if (this.app) {
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
// const injects = (x: IRootStore) => ({
// 	...injectAppsStore(x),
// 	 ...injectUserStore(x),
// })

export default inject(injectAppsStore)(observer(AppPage))
