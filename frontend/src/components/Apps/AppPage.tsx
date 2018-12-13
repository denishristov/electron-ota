import React, { Component, FormEvent } from 'react'
import { observer } from 'mobx-react';
import App from '../../stores/App';
import { bind } from 'bind-decorator';

interface IProps {
	app: App
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
		this.props.app.fetchVersions()
	}

	@bind
	handleCreateVersion(event: ICreateVersionEvent) {
		event.preventDefault()

		const { versionName, isCritical, isBase } = event.target.elements

		this.props.app.emitCreateVersion({ 
			versionName: versionName.value, 
			isCritical: isCritical.checked, 
			isBase: isBase.checked 
		})
	}

	render() {
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
					<button type="submit">
						Create version
					</button>
				</form>
			</div>
		)
	}
}


export default observer(AppPage)