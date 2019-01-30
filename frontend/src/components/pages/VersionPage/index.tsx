import React from 'react'
import Container from '../../generic/Container'

import Button from '../../generic/Button'
import Flex from '../../generic/Flex'
import { IVersionModel, IVersionReportModel, IClientModel, IErrorReport } from 'shared'
import { RouteComponentProps, Redirect } from 'react-router'
import { IAppsStore } from '../../../stores/AppsStore'
import { computed } from 'mobx'
import { IApp } from '../../../stores/App'
import Loading from '../../generic/Loading'
import { observer } from 'mobx-react'
import { downloadFile, formatDate } from '../../../util/functions'

import styles from '../../../styles/VersionPage.module.sass'

import ClientRow from './ClientRow'
import Client from './Client'
import ErrorMessage from './ErrorMessage'
import icons from '../../../util/constants/icons'

interface IParams {
	appId: string
	versionId: string
}

const clientMapper = (client: IClientModel) => (
	<Client key={client.id} client={client} />
)
const errorMapper = ({ client, errorMessage }: IErrorReport) => (
	<ErrorMessage key={client.id} client={client} errorMessage={errorMessage} />
)

@observer
export default class VersionPage extends React.Component<RouteComponentProps<IParams>> {
	public readonly state = {
		hasLoaded: false,
	}

	@DI.lazyInject(DI.Stores.Apps)
	private readonly appsStore!: IAppsStore

	@computed
	private get app(): IApp | null {
		const { appId } = this.props.match.params
		return this.appsStore.getApp(appId) || null
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
		if (!this.appsStore.allApps.length) {
			await this.appsStore.fetchApps()
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
						{description && (
							<>
								<label>Description</label>
								<p>{description}</p>
							</>
						)}
						{hash && (
							<>
								<label>Hash</label>
								<h3>{description}</h3>
							</>
						)}
						{createdAt && (
							<>
								<label>Added on</label>
								<h3>{formatDate(new Date(createdAt))}</h3>
							</>
						)}
						<label>Supports</label>
						<Flex list>
							{Object.keys(systems)
								.filter((key) => systems[key])
								.map((key) => <SVG key={key} src={icons[key]} />)
							}
						</Flex>
						{this.reports && (
							<Flex centerX margin list>
								<ClientRow
									title='Downloading'
									clients={this.reports.downloading}
									mapper={clientMapper}
								/>
								<ClientRow
									title='Downloaded'
									clients={this.reports.downloaded}
									mapper={clientMapper}
								/>
								<ClientRow
									title='Using'
									clients={this.reports.using}
									mapper={clientMapper}
								/>
								<ClientRow
									clients={this.reports.errorMessages}
									title='Errors'
									mapper={errorMapper}
								/>
							</Flex>
						)}
					</Flex>
				</div>
			</Container>
		)
	}

	@bind
	private handleRelease() {
		this.version && this.appsStore.emitPublishVersion({ versionId: this.version.id })
	}

	@bind
	private handleDownload() {
		this.version && downloadFile(this.version.downloadUrl, this.version.versionName)
	}
}
