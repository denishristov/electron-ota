import { bind } from 'bind-decorator'
import { computed } from 'mobx'
import { inject, observer } from 'mobx-react'
import React, { Component, FormEvent } from 'react'
import { Redirect, RouteComponentProps } from 'react-router'

import App from '../../stores/App'
import AppsStore from '../../stores/AppsStore'
import { injectAppsStore, injectUserStore, IRootStore } from '../../stores/RootStore'
import { IVersionModel } from 'shared'

import Modal from '../Generic/Modal'
import Input from '../Generic/Input'
import Button from '../Generic/Button'

import Plus from '../../img/Plus.svg'

import '../../styles/AppsPage.sass'
import '../../styles/AppPage.sass'

import { hashBlob } from '../../util/functions'
import Version from './Version'
import { IUserStore } from '../../stores/UserStore'
import Container from '../Generic/Container';

interface IParams {
	id: string
}

interface IProps extends RouteComponentProps<IParams> {
	appsStore: AppsStore
	style: object
	// userStore: IUserStore
}

interface IState {
	isLoaded: boolean
}

interface ICreateVersionEvent extends FormEvent<HTMLFormElement> {
	target: EventTarget & {
		elements: {
			versionName: HTMLInputElement
			isCritical: HTMLInputElement
			isBase: HTMLInputElement
			version: HTMLInputElement & {
				files: FileList,
			},
		},
	}
}

class AppPage extends Component<IProps, IState> {
	public readonly state = {
		isLoaded: false,
	}

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

		this.setState({ isLoaded: true })
	}

	public render() {
		if (!this.state.isLoaded) {
			return <div>Loading</div>
		}

		if (!this.app) {
			return <Redirect to='/apps' />
		}

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
				<Modal title='Add a new version' ref={this.modalRef}>
					<form onSubmit={this.handleCreateVersion}>
						<Input
							type='text'
							name='versionName'
							label='Name'
							/>
						<Input
							type='checkbox'
							name='isCritical'
							label='Is critical?'
							/>
						<Input
							type='checkbox'
							name='isBase'
							label='Is base?'
							/>
						<Input
							type='file'
							name='version'
							label='ASAR'
							/>
						<Button color='blue' noShadow type='submit'>
							Create version
						</Button>
					</form>
				</Modal>
			</Container>
		)
	}

	@bind
	private async handleCreateVersion(event: ICreateVersionEvent) {
		event.preventDefault()

		const {
			versionName,
			isCritical,
			isBase,
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

				const upload = fetch(signedRequest, {
					body: versionFile,
					method: 'PUT',
				})

				const [hash] = await Promise.all([
					hashBlob(versionFile),
					upload,
				])

				this.app.emitCreateVersion({
					downloadUrl,
					hash,
					isBase: isBase.checked,
					isCritical: isCritical.checked,
					versionName: versionName.value,
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
			systems: {
				Windows_RT: true,
				Darwin: true,
				Linux: true,
			},
		})
	}
}
// const injects = (x: IRootStore) => ({
// 	...injectAppsStore(x),
// 	 ...injectUserStore(x),
// })

export default inject(injectAppsStore)(observer(AppPage))
