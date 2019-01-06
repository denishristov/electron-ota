import { inject, observer } from 'mobx-react'
import React, { Component, FormEvent } from 'react'
import { IAppModel } from 'shared'
import AppStore from '../../stores/AppsStore'
import { injectAppsStore } from '../../stores/RootStore'

import App from './App'

import Input from '../Generic/Input'
import Button from '../Generic/Button'
import Modal from '../Generic/Modal'
import Row from '../Generic/Row'

import Camera from '../../img/Camera.svg'
import Plus from '../../img/Plus.svg'

import { RouterProps } from 'react-router'
import axios from 'axios'
import '../../styles/AppsPage.sass'
import { getSourceFromFile } from '../../util/functions'

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

interface ISelectPictureEvent extends React.ChangeEvent<HTMLInputElement> {
	target: EventTarget & HTMLInputElement & {
		files: FileList,
	}
}

interface IProps extends RouterProps {
	appsStore: AppStore
}

interface IState {
	pictureSrc: string | null
}

const displayNone = { display: 'none' }

class AppsContainer extends Component<IProps, IState> {
	public readonly state = {
		pictureSrc: '',
	}

	private readonly fileInputRef = React.createRef<HTMLInputElement>()

	private readonly modalRef = React.createRef<Modal>()

	public componentDidMount() {
		this.props.appsStore.fetchApps()
	}

	@bind
	public async handleCreateApp(event: ICreateAppEvent) {
		event.preventDefault()

		const { name, picture, bundleId } = event.target.elements

		const pictureFile = picture.files[0]
		const { name: pictureName, type } = pictureFile

		const {
			downloadUrl,
			signedRequest,
		} = await this.props.appsStore.fetchUploadPictureUrl({ name: pictureName, type })

		await axios.put(signedRequest, pictureFile, {
			headers: {
				'Content-Type': pictureFile.type,
			},
		})

		this.props.appsStore.emitCreateApp({
			bundleId: bundleId.value,
			name: name.value,
			pictureUrl: downloadUrl,
		})

		const { current } = this.modalRef
		current && current.close()
	}

	public render() {
		const { allApps } = this.props.appsStore

		return (
			<>
				<div className='apps-page-container'>
					<header>
						<h1>Apps</h1>
						<Button color='green' size='small' onClick={this.openModal}>
							<SVG src={Plus} />
							Add new app
						</Button>
					</header>
					<div className='apps-container'>
						{allApps.map((app) =>
							<App app={app.toModel()} key={app.id} history={this.props.history} />,
						)}
					</div>
				</div>
				<Modal title='Add a new app' ref={this.modalRef}>
					<form onSubmit={this.handleCreateApp}>
						<Row>
							<div className='upload-container'>
								{this.state.pictureSrc
								 	? <img
										src={this.state.pictureSrc}
										className='upload-icon'
										onClick={this.handleOpenFileMenu}
									/>
									: <SVG
										src={Camera}
										className='upload-icon'
										onClick={this.handleOpenFileMenu}
									/>
								}
								<input
									type='file'
									name='picture'
									accept='image/*'
									style={displayNone}
									ref={this.fileInputRef}
									onChange={this.handleSelectPicture}
								/>
								<label>Upload Icon</label>
							</div>
							<div>
								<Input
									type='text'
									name='name'
									label='Name'
								/>
								<Input
									type='text'
									name='bundleId'
									label='Bundle ID'
								/>
							</div>
						</Row>
						<Button color='green' type='submit'>
							Add
						</Button>
					</form>
				</Modal>
			</>
		)
	}

	@bind
	private handleOpenFileMenu() {
		const { current } = this.fileInputRef

		if (current) {
			current.click()
		}
	}

	@bind
	private async handleSelectPicture(event: ISelectPictureEvent) {
		const pictureFile = event.target.files[0]
		const pictureSrc = await getSourceFromFile(pictureFile)

		this.setState({ pictureSrc })
	}

	@bind
	private openModal() {
		const { current } = this.modalRef
		current && current.open()
	}
}

export default inject(injectAppsStore)(observer(AppsContainer))
