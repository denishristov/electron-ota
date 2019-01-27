import { inject, observer } from 'mobx-react'
import React, { Component, FormEvent } from 'react'
import AppStore from '../../stores/AppsStore'
import { injectAppsStore } from '../../stores/RootStore'

import App from './App'

import Input from '../Generic/Input'
import Button from '../Generic/Button'
import Modal from '../Generic/Modal'
import Flex from '../Generic/Flex'

import Camera from '../../img/Camera.svg'
import Plus from '../../img/Plus.svg'

import { RouterProps } from 'react-router'
import axios from 'axios'
import { getSourceFromFile } from '../../util/functions'
import Container from '../Generic/Container'
import Dropzone from '../Generic/Dropzone'
import AppearAnimation from '../Generic/AppearAnimation'

import styles from '../../styles/AppsPage.module.sass'

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

interface IProps extends RouterProps {
	appsStore: AppStore
	style: object
}

interface IState {
	pictureSrc: string | null
}

class AppsContainer extends Component<IProps, IState> {
	public readonly state = {
		pictureSrc: '',
	}

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
			<Container style={this.props.style}>
				<div className={styles.appsPageContainer}>
					<header>
						<h1>Apps</h1>
						<Button color='blue' noShadow size='small' onClick={this.openModal}>
							<SVG src={Plus} />
							Add new app
						</Button>
					</header>
					<div className={styles.appsContainer}>
						<AppearAnimation items={allApps}>
							{(app) => (animation) => (
								<App
									app={app.toModel()}
									key={app.id}
									history={this.props.history}
									animation={animation}
								/>
							)}
						</AppearAnimation>
					</div>
				</div>
				<Modal title='Add a new app' ref={this.modalRef}>
					<form onSubmit={this.handleCreateApp} className={styles.newApp}>
						<Flex fill margin>
							<Flex margin centerY column className={styles.uploadContainer}>
								<Dropzone
									onDrop={this.handleSelectPicture}
									name='picture'
									accept='image/*'
									className={styles.dropzone}
								>
									{this.state.pictureSrc
									 	? <img src={this.state.pictureSrc} className={styles.uploadIcon} />
										: <SVG src={Camera} className={styles.uploadIcon} />
									}
								</Dropzone>
								<label className={styles.uploadLabel}>Upload Icon</label>
							</Flex>
							<Flex margin column>
								<Input name='name' label='Name' />
								<Input name='bundleId' label='Bundle ID' />
							</Flex>
						</Flex>
						<footer>
							<Button
								size='small'
								color='blue'
								noShadow
								type='submit'
							>
								Add
							</Button>
						</footer>
					</form>
				</Modal>
			</Container>
		)
	}

	@bind
	private async handleSelectPicture([pictureFile]: File[]) {
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
