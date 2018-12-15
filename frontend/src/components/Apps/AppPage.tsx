import React, { Component, FormEvent } from 'react'
import { observer, inject } from 'mobx-react';
import App from '../../stores/App';
import { bind } from 'bind-decorator';
import AppsStore from '../../stores/AppsStore';
import { RouteComponentProps, Redirect } from 'react-router';
import { computed } from 'mobx';
import { injectAppsStore } from '../../stores/RootStore';

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
		}
	}
}

class AppPage extends Component<IProps> {
	componentDidMount() {
		if (this.app) {
			this.app.fetchVersions()
		}
	}

	@computed
	get app(): App | null {
		return this.props.appsStore.getApp(this.props.match.params.id)
	}

	@bind
	handleCreateVersion(event: ICreateVersionEvent) {
		event.preventDefault()

		const { versionName, isCritical, isBase } = event.target.elements

		this.app!.emitCreateVersion({ 
			versionName: versionName.value, 
			isCritical: isCritical.checked, 
			isBase: isBase.checked 
		})
	}

	render() {
		if (!this.app) {
			return <Redirect to='/apps' />
		}

		const {
			name,
			renderableVersions
		} = this.app

		return (
			<div>
				<form onSubmit={this.handleCreateVersion}>
					<input 
						type="text"
						name="versionName"
						placeholder="Version"
					/>
					<input 
						type="checkbox"
						name="isCritical"
						placeholder="Is critical?"
					/>
					<input 
						type="checkbox"
						name="isBase"
						placeholder="Is base?"
					/>
					<input
						type="file"
						name="app"
						placeholder="wow"
						// onChange={x => console.log(x.nativeEvent.target.files[0])}
					/>
					<button type="submit">
						Create version
					</button>
				</form>
				<h1>{name}</h1>
				<h2>Versions</h2>
				{renderableVersions.map(version => (
					<div key={version.id}>
						<h1>{version.versionName}</h1>
					</div>
				))}
			</div>
		)
	}
}


export default inject(injectAppsStore)(observer(AppPage))