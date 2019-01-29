import React, { version } from 'react'
import Container from '../../generic/Container'

import Button from '../../generic/Button'
import Flex from '../../generic/Flex'
import { IVersionModel } from 'shared'
import { RouteComponentProps, Redirect } from 'react-router'
import { IAppsStore } from '../../../stores/AppsStore'
import { computed } from 'mobx'
import { IApp } from '../../../stores/App'
import Loading from '../../generic/Loading'
import { inject, observer } from 'mobx-react'
import { injectAppsStore } from '../../../stores/RootStore'
import { IVersionReportModel } from '../../../../../shared/dist/interfaces/Reports'
import { downloadFile } from '../../../util/functions'

import styles from '../../../styles/VersionPage.module.sass'
import ClientRow from './ClientRow'

interface IParams {
	appId: string
	versionId: string
}

interface IProps extends RouteComponentProps<IParams> {
	appsStore: IAppsStore
}

class VersionPage extends React.Component<IProps> {
	public readonly state = {
		hasLoaded: false,
	}

	@computed
	private get app(): IApp | null {
		const { appId } = this.props.match.params
		return this.props.appsStore.getApp(appId) || null
	}

	@computed
	private get version(): IVersionModel | null {
		const { versionId } = this.props.match.params
		return this.app && this.app.getVersion(versionId) || null
	}

	@computed
	get reports(): IVersionReportModel | null {
		return this.app && this.version && this.app.reports.get(this.version.id) || null
	}

	public async componentDidMount() {
		if (!this.props.appsStore.allApps.length) {
			await this.props.appsStore.fetchApps()
		}

		if (this.app) {
			await this.app.fetchVersions()

			if (this.version) {
				this.app.fetchReports(this.version.id)
			}
		}

		this.setState({ hasLoaded: true })
	}

	public render() {
		if (!this.state.hasLoaded) {
			return <Loading />
		}

		if (!this.version) {
			return <Redirect to='/apps' />
		}

		const {
			systems,
			description,
			versionName,
			isBase,
			isCritical,
			createdAt,
			hash,
			downloadUrl,
		} = this.version

		return (
			<Container>
				<div className={styles.container}>
					<header>
						<h1>{versionName}</h1>
						{/* <Modal> */}
							<Button color='blue' size='small' onClick={this.handleRelease}>
								Release
							</Button>
							<Button color='white' size='small' onClick={this.handleDownload}>
								Download
							</Button>
							<Button color='orange' size='small' onClick={this.handleRelease}>
								Edit
							</Button>
							<Button color='red' size='small' onClick={this.handleRelease}>
								Delete
							</Button>
							{/* </Modal.OpenTrigger>
							<CreateAppModal />
						</Modal> */}
					</header>
					<Flex column>
						{description}
						{this.reports && (
							<Flex centerY centerX margin list>
								<ClientRow title='Downloading' clients={this.reports.downloading} />
								<ClientRow title='Downloaded' clients={this.reports.downloaded} />
								<ClientRow title='Using' clients={this.reports.using} />
								{/* <ClientRow title='Errors' clients={this.reports.errorMessages} /> */}
							</Flex>
						)}
					</Flex>
				</div>
			</Container>
		)
	}

	@bind
	private handleRelease() {
		this.version && this.props.appsStore.emitPublishVersion({ versionId: this.version.id })
	}

	@bind
	private handleDownload() {
		this.version && downloadFile(this.version.downloadUrl, this.version.versionName)
	}
}

export default inject(injectAppsStore)(observer(VersionPage))
