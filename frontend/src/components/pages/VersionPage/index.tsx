import React from 'react'
import Container from '../../generic/Container'

import Button from '../../generic/Button'
import Flex from '../../generic/Flex'
import { VersionModel, VersionReportModel, ClientModel, ErrorReport } from 'shared'
import { RouteComponentProps, Redirect } from 'react-router'
import { IAppsStore } from '../../../stores/AppsStore'
import { computed } from 'mobx'
import { IApp } from '../../../stores/App'
import Loading from '../../generic/Loading'
import { observer } from 'mobx-react'
import { downloadFile, formatDate } from '../../../util/functions'

import styles from '../../../styles/VersionPage.module.sass'
import versionStyles from '../../../styles/Version.module.sass'
import versionModalStyles from '../../../styles/VersionModal.module.sass'

import ClientRow from './ClientRow'
import Client from './Client'
import ErrorMessage from './ErrorMessage'
import icons from '../../../util/constants/icons'
import Tip from '../../generic/Tip'
import VersionModal from '../../modals/VersionModal'
import Modal from '../../generic/Modal'

interface IParams {
	appId: string
	versionId: string
}

const clientMapper = (client: ClientModel) => (
	<Client key={client.id} client={client} />
)
const errorMapper = ({ client, errorMessage }: ErrorReport) => (
	<ErrorMessage key={client.id} client={client} errorMessage={errorMessage} />
)

@observer
export default class VersionPage extends React.Component<RouteComponentProps<IParams>> {
	public readonly state = {
		hasLoaded: false,
	}

	@DI.lazyInject(DI.Stores.Apps)
	private readonly appsStore: IAppsStore

	@computed
	private get app(): IApp | null {
		const { appId } = this.props.match.params
		return this.appsStore.getApp(appId) || null
	}

	@computed
	private get version(): VersionModel | null {
		const { versionId } = this.props.match.params
		return this.app && this.app.getVersion(versionId) || null
	}

	@computed
	get reports(): VersionReportModel | null {
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

		if (!this.app || !this.version) {
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
						<img src={this.app.pictureUrl} />
						<h1>{`${this.app.name} v${versionName}`}</h1>
					</header>
					<Flex m x>
						<Flex col m p list className={styles.details}>
							{createdAt && (
								<div>
									<h3>Added on</h3>
									<h4>{formatDate(new Date(createdAt))}</h4>
								</div>
							)}
							<Modal>
								<Modal.OpenTrigger>
									<Tip message='Edit' className={styles.editIcon}>
										<SVG src={icons.Edit} />
									</Tip>
								</Modal.OpenTrigger>
								<Modal.Content
									title={`Edit ${versionName}`}
									className={versionModalStyles.versionModal}
									component={VersionModal}
									props={{
										app: this.app,
										version: this.version,
									}}
								/>
							</Modal>
							{hash && (
								<div>
									<h3>Hash</h3>
									<h4>{hash}</h4>
								</div>
							)}
							{description && (
								<div>
									<h3>Description</h3>
									<p>{description}</p>
								</div>
							)}
							<Flex spread y>
								<h3>Supports</h3>
								<Flex list>
									{Object.keys(systems)
										.filter((key) => systems[key])
										.map((key) => <SVG key={key} src={icons[key]} />)
									}
								</Flex>
							</Flex>
							<Flex y spread>
								<h3>Labels</h3>
								<Flex list>
									{isBase && (
										<Flex y>
											<div className={versionStyles.base} />
											<label>Base</label>
										</Flex>
									)}
									{isCritical && (
										<Flex y>
											<div className={versionStyles.critical} />
											<label>Critical</label>
										</Flex>
									)}
								</Flex>
							</Flex>
							<Flex list m spread>
								<Button color='white' size='small' onClick={this.handleDownload}>
									<SVG src={icons.Download} />
									Download
								</Button>
								<Button color='blue' size='small' onClick={this.handleRelease}>
									<SVG src={icons.Upload} />
									Release
								</Button>
							</Flex>
						</Flex>
						<Flex list x>
							{this.reports && (
								<>
									<ClientRow
										icon={icons.Success}
										title='Using'
										clients={this.reports.using}
										mapper={clientMapper}
									/>
									<ClientRow
										icon={icons.Downloading}
										title='Downloading'
										clients={this.reports.downloading}
										mapper={clientMapper}
									/>
									<ClientRow
										icon={icons.Downloaded}
										title='Downloaded'
										clients={this.reports.downloaded}
										mapper={clientMapper}
									/>
									<ClientRow
										icon={icons.ErrorIcon}
										clients={this.reports.errorMessages}
										title='Errors'
										mapper={errorMapper}
									/>
								</>
							)}
						</Flex>
					</Flex>
				</div>
			</Container>
		)
	}

	@bind
	private handleRelease() {
		this.version && this.appsStore.releaseUpdate({ versionId: this.version.id })}

	@bind
	private handleDownload() {
		this.version && this.version.downloadUrl && downloadFile(this.version.downloadUrl, this.version.versionName || 'app')
	}
}
