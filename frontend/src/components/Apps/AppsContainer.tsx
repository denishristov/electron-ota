import React, { FormEvent } from 'react'
import { observer, inject } from 'mobx-react'
import AppStore from '../../stores/AppsStore'
import App from './App'
import bind from 'bind-decorator'

interface ICreateAppEvent extends FormEvent<HTMLFormElement> {
	target: EventTarget & {
		elements: {
			name: HTMLInputElement
			pictureUrl: HTMLInputElement
			bundleId: HTMLInputElement
		}
	}
}

interface IAppsProps {
	appsStore: AppStore
}

class AppsContainer extends React.Component<IAppsProps> {
	componentDidMount() {
		this.props.appsStore.fetchApps()
	}

	@bind
	handleCreateApp(event: ICreateAppEvent) {
		event.preventDefault()

		const { name, pictureUrl, bundleId } = event.target.elements

		this.props.appsStore.emitCreateApp({ 
			name: name.value, 
			pictureUrl: pictureUrl.value, 
			bundleId: bundleId.value 
		})
	}
	
	render() {
		const { renderableApps } = this.props.appsStore

		return (
			<div>
				<form onSubmit={this.handleCreateApp}>
					<input 
						type="text"
						name="name"
						placeholder="Name"
					/>
					<input 
						type="text"
						name="bundleId"
						placeholder="Bundle"
					/>
					<input 
						type="text"
						name="pictureUrl"
						placeholder="Picture url"
					/>
					{/* <input 
						type="checkbox"
						name="isCritical"
						value="true"
						placeholder="Is critical?"
					/> */}
					<button type="submit">
						Create app
					</button>
				</form>
				<h1>Apps</h1>
				{renderableApps.map((app: any) => <App app={app} key={app.id} />)}
			</div>
		)
	}
}


export default inject(({ appsStore }) => ({ appsStore }))(observer(AppsContainer))