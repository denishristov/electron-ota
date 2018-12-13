import React, { Component } from 'react'
import { observer, inject } from 'mobx-react';
import AppsStore from '../../stores/AppsStore';
import bind from 'bind-decorator';

interface IProps {
	app: any
	appsStore: AppsStore
	// emitUpdateApp: Function
	// emitDeleteApp: Function
}

class App extends Component<IProps> {
	@bind
	handleDeleteApp() {
		const { appsStore, app } = this.props

		appsStore.emitDeleteApp({ id: app.id })
	}

	render() {
		const {
			app,
			appsStore
			// emitUpdateApp,
			// emitDeleteApp
		} = this.props

		const {
			name,
			bundleId,
			pictureUrl
		} = app

		return (
			<div>
				<img src={pictureUrl} />
				<h1>{name}</h1>
				<h2>{`Bundle id: ${bundleId}`}</h2>
				<button onClick={this.handleDeleteApp}>
					Delete
				</button>
			</div>
		)
	}
}

export default inject(({ appsStore }) => ({ appsStore }))(observer(App))