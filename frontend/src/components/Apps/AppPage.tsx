import { computed } from 'mobx'
import { inject, observer } from 'mobx-react'
import React, { Component, FormEvent } from 'react'
import { Redirect, RouteComponentProps } from 'react-router'
import axios from 'axios'

import App from '../../stores/App'
import AppsStore from '../../stores/AppsStore'
import { hashBlob, formatFileSize } from '../../util/functions'
import { injectAppsStore } from '../../stores/RootStore'
import { IVersionModel } from 'shared'
import Version from './Version'

import Modal from '../Generic/Modal'
import Input from '../Generic/Input'
import Button from '../Generic/Button'
import Container from '../Generic/Container'
import Switch from '../Generic/Switch'
import Row from '../Generic/Row'
import Column from '../Generic/Column'
import Dropzone from '../Generic/Dropzone'

import Plus from '../../img/Plus.svg'
import Windows from '../../img/Windows.svg'
import Apple from '../../img/Apple.svg'
import Ubuntu from '../../img/Ubuntu.svg'
import Electron from '../../img/Electron.svg'

import '../../styles/AppsPage.sass'
import '../../styles/AppPage.sass'

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

class AppPage extends Component<IProps, IState> {
	public readonly state = {
		hasLoaded: false,
		isCritical: false,
		isBase: false,
		isReleasing: false,
		isWindows: true,
		isDarwin: true,
		isLinux: true,
		file: void 0,
	} as IState

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
		}

		this.setState({ hasLoaded: true })
	}

	public render() {
		if (!this.state.hasLoaded) {
			return <div></div>
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
		} = this.app

		return (
			<Container style={this.props.style}>
				<div className='apps-page-container'>
					<header>
						<h1>{name}</h1>
						<Button color='blue' noShadow size='small' onClick={this.openModal}>
							<SVG src={Plus} />
							Add new version
						</Button>
					</header>
					<div className='version-container'>
						{allVersions.map((version) => (
							<Version version={version} key={version.id} />
						))}
					</div>
				</div>
				<Modal
					title='Add a new version'
					className='version-modal'
					progress={progress}
					ref={this.modalRef}
				>
					<form onSubmit={this.handleCreateVersion}>
						<Row>
							<Column>
								<Input
									type='text'
									name='versionName'
									label='Name'
								/>
								<label>Description</label>
								<textarea placeholder='Optional description for the update' />
							</Column>
							<Column>
								<label>Supporting systems</label>
								<Row className='os-row'>
									<SVG src={Windows} />
									<label className='light'>Windows</label>
									<Switch value={isWindows} onChange={this.toggleIsWindows} />
								</Row>
								<Row className='os-row'>
									<SVG src={Apple} />
									<label className='light'>Macos</label>
									<Switch value={isDarwin} onChange={this.toggleIsDarwin}	/>
								</Row>
								<Row className='os-row'>
									<SVG src={Ubuntu} />
									<label className='light'>Ubuntu</label>
									<Switch value={isLinux} onChange={this.toggleIsLinux} />
								</Row>
								<label>Release</label>
								<Row className='spread center-y'>
									<label className='light'>
										Immediately?
									</label>
									<Switch value={isReleasing} onChange={this.toggleIsReleasing} />
								</Row>
								<Row className='spread center-y'>
									<label className='light'>
										Critical?
									</label>
									<Switch value={isCritical} onChange={this.toggleIsCritical} />
								</Row>
								<Row className='spread center-y'>
									<label className='light'>
										Base?
									</label>
									<Switch value={isBase} onChange={this.toggleIsBase} />
								</Row>
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
											<Row className='expand'>
												<Row className='spread center-y'>
													<label className='text-overflow'>{file.name}</label>
												</Row>
												<Row className='spread center-y'>
													<label className='light'>
														{formatFileSize(file.size)}
													</label>
													<label className='light'>
														{file.date.toLocaleDateString()}
													</label>
												</Row>
											</Row>
										</>
									)}
									</Dropzone>
								)}
							</Column>
						</Row>
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
			const versionFile = version.files[0]

			if (versionFile) {
				const { name, type } = versionFile
				const {
					downloadUrl,
					signedRequest,
				} = await this.app.fetchSignedUploadVersionUrl({ name, type })
				console.log(versionFile)

				const upload = axios.put(signedRequest, versionFile, {
					headers: {
						'Content-Type': type,
					},
					onUploadProgress: ({ loaded, total }) => {
						const progress = Math.round((loaded * 100) / total)
						console.log(progress)
						this.setState({ progress })
					},
				})

				const [hash] = await Promise.all([
					hashBlob(versionFile),
					upload,
				])

				const {
					isCritical,
					isBase,
					isWindows,
					isDarwin,
					isLinux,
				} = this.state

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

				this.closeModal()
			}
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
}
// const injects = (x: IRootStore) => ({
// 	...injectAppsStore(x),
// 	 ...injectUserStore(x),
// })

export default inject(injectAppsStore)(observer(AppPage))
