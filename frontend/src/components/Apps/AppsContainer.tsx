import bind from 'bind-decorator'
import { inject, observer } from 'mobx-react'
import React, { FormEvent } from 'react'
import { IAppModel } from 'shared'
import AppStore from '../../stores/AppsStore'
import { injectAppsStore } from '../../stores/RootStore'
import App from './App'

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

interface IAppsProps {
	appsStore: AppStore
}

class AppsContainer extends React.Component<IAppsProps> {
	public componentDidMount() {
		this.props.appsStore.fetchApps()
	}

	@bind
	public async handleCreateApp(event: ICreateAppEvent) {
		event.preventDefault()

		const { name, picture, bundleId } = event.target.elements

		const pictureFile = picture.files[0]
		const { name: pictureName, type } = pictureFile

		const { downloadUrl, signedRequest } = await this.props.appsStore.fetchUploadPictureUrl({ name: pictureName, type })

		await fetch(signedRequest, {
			body: pictureFile,
			method: 'PUT',
		// tslint:disable-next-line:no-console
		}).then(console.log)

		this.props.appsStore.emitCreateApp({
			bundleId: bundleId.value,
			name: name.value,
			pictureUrl: downloadUrl,
		})
	}

	public render() {
		const { renderableApps } = this.props.appsStore

		return (
			<div>
				<form onSubmit={this.handleCreateApp}>
					<input
						type='text'
						name='name'
						placeholder='Name'
					/>
					<input
						type='text'
						name='bundleId'
						placeholder='Bundle'
					/>
					<input
						type='file'
						name='picture'
						placeholder='Picture url'
					/>
					{/* <input
						type="checkbox"
						name="isCritical"
						value="true"
						placeholder="Is critical?"
					/> */}
					<button type='submit'>
						Create app
					</button>
				</form>
				<h1>Apps</h1>
				{renderableApps.map((app: IAppModel) => <App app={app} key={app.id} />)}
			</div>
		)
	}
}

export default inject(injectAppsStore)(observer(AppsContainer))
