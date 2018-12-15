import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import AppsStore from '../../stores/AppsStore'
import bind from 'bind-decorator'
import { IAppModel } from 'shared'
import { Link } from 'react-router-dom'
import { injectAppsStore } from '../../stores/RootStore';

interface IProps {
	app: IAppModel
	appsStore: AppsStore
}

class App extends Component<IProps> {
	@bind
	handleDeleteApp() {
		const { appsStore, app } = this.props

		appsStore.emitDeleteApp({ id: app.id })
	}

	render() {
		const {
			id,
			name,
			bundleId,
			pictureUrl
		} = this.props.app

		return (
			<div>
				<img src={pictureUrl} />
				<h1>{name}</h1>
				<h2>{`Bundle id: ${bundleId}`}</h2>
				<Link to={`/apps/${id}`}>
					<button>
						Open
					</button>
				</Link>
				<button onClick={this.handleDeleteApp}>
					Delete
				</button>
			</div>
		)
	}
}

export default inject(injectAppsStore)(observer(App))