import { bind } from 'bind-decorator'
import { computed } from 'mobx'
import { inject, observer } from 'mobx-react'
import React, { Component, FormEvent } from 'react'
import { Redirect, RouteComponentProps } from 'react-router'

import App from '../../stores/App'
import AppsStore from '../../stores/AppsStore'
import { injectAppsStore } from '../../stores/RootStore'
import { IVersionModel } from 'shared'

import Modal from '../Generic/Modal'
import Input from '../Generic/Input'
import Button from '../Generic/Button'

import Plus from '../../img/Plus.svg'

import '../../styles/AppsPage.sass'
import { hashBlob } from '../../util/functions'

interface IParams {
	id: string
}

interface IProps extends RouteComponentProps<IParams> {
	appsStore: AppsStore
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

class AppPage extends Component<IProps> {
	private readonly modalRef = React.createRef<Modal>()

	@computed
	private get app(): App | null {
		return this.props.appsStore.getApp(this.props.match.params.id) || null
	}

	public componentDidMount() {
		if (this.app) {
			this.app.fetchVersions()
		}
	}

	public render() {
		if (!this.app) {
			return <Redirect to='/apps' />
		}

		const {
			name,
			allVersions,
		} = this.app

		return (
			<>
				<div className='apps-page-container'>
					<header>
						<h1>{name}</h1>
						<Button color='green' size='small' onClick={this.openModal}>
							<SVG src={Plus} />
							Add new version
						</Button>
					</header>
					{allVersions.length
						? <table>
							<thead>
								<tr>
									{Object.keys(allVersions[0]).map((key) =>
										<th key={key}>{key}</th>,
									)}
								</tr>
							</thead>
							<tbody>
								{allVersions.map((version) =>
									<tr key={version.id}>
										{Object.values(version).map((value) =>
											<th key={value}>
												{String(value)}
											</th>,
										)}
										{!version.isPublished &&
											<button onClick={() => this.handleReleaseVersion(version)}>
												Release
											</button>
										}
									</tr>,
								)}
							</tbody>
						</table>
						: null
					}
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
						<Button color='green' type='submit'>
							Create version
						</Button>
					</form>
				</Modal>
			</>
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
		this.props.appsStore.emitPublishVersion(version)
	}
}

export default inject(injectAppsStore)(observer(AppPage))
