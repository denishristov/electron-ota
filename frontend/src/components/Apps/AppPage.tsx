import React, { Component, FormEvent } from 'react'
import { observer, inject } from 'mobx-react';
import App from '../../stores/App';
import { bind } from 'bind-decorator';
import AppsStore from '../../stores/AppsStore';
import { RouteComponentProps, Redirect } from 'react-router';
import { computed } from 'mobx';
import { injectAppsStore } from '../../stores/RootStore';
import { IVersionModel } from 'shared';

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
				files: FileList
			}
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
	async handleCreateVersion(event: ICreateVersionEvent) {
		event.preventDefault()

		const { versionName, isCritical, isBase, version } = event.target.elements

		if (this.app) {
			const versionFile = version.files[0]
			const { name, type } = versionFile
			const { downloadUrl, signedRequest } = await this.app.fetchSignedUploadVersionUrl({ name, type })

			await fetch(signedRequest, {
				method: 'PUT',
				body: versionFile,
			}).then(console.log)
			
			this.app.emitCreateVersion({ 
				versionName: versionName.value, 
				isCritical: isCritical.checked, 
				isBase: isBase.checked,
				downloadUrl
			})
		}
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
						name="version"
						placeholder="wow"
						// onChange={x => console.log(x.nativeEvent)}
					/>
					<button type="submit">
						Create version
					</button>
				</form>
				<h1>{name}</h1>
				<h2>Versions</h2>
				{renderableVersions.length
					? <table>
						<thead>
							<tr>
								{Object.keys(renderableVersions[0]).map(key =>
									<th key={key}>{key}</th>
								)}
							</tr>
						</thead>
						<tbody>
							{renderableVersions.map(version => 
								<tr key={version.id}>
									{Object.values(version).map(value => 
										<th key={value}>
											{String(value)}
										</th>
									)}
								</tr>	
							)}
						</tbody>
					</table>
					: null
				}
			</div>
		)
	}
}


export default inject(injectAppsStore)(observer(AppPage))