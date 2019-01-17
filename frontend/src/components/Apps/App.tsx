import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { IAppModel } from 'shared'
import AppsStore from '../../stores/AppsStore'
import { injectAppsStore } from '../../stores/RootStore'
import { RouterProps } from 'react-router'
import Row from '../Generic/Row'

interface IProps extends RouterProps {
	app: IAppModel
	appsStore: AppsStore
}

class App extends Component<IProps> {
	@bind
	public handleDeleteApp() {
		const { appsStore, app } = this.props

		appsStore.emitDeleteApp({ id: app.id })
	}

	public render() {
		const {
			name,
			bundleId,
			pictureUrl,
			latestVersion,
			versions,
		} = this.props.app

		return (
			<div className='app-tile' onClick={this.goToApp}>
				<Row className='top-row'>
					<img src={pictureUrl} />
					<h1>{name}</h1>
				</Row>
				<label>{`Bundle ID ${bundleId}`}</label>
				<label>{`Versions ${versions}`}</label>
				<label>{`Latest version ${latestVersion}`}</label>
			</div>
		)
	}

	@bind
	private goToApp() {
		this.props.history.push(`/apps/${this.props.app.id}`)
	}
}

export default inject(injectAppsStore)(observer(App))
