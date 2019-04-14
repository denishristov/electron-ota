import React from 'react'
import Container from '../../generic/Container'

import Button from '../../generic/Button'
import Flex from '../../generic/Flex'
import { VersionModel, VersionReportModel, ReportModel, SystemTypeDisplay } from 'shared'
import { RouteComponentProps, Redirect } from 'react-router'
import { IAppsStore } from '../../../stores/AppsStore'
import { computed } from 'mobx'
import { IApp } from '../../../stores/App'
import Loading from '../../generic/LoadingContainer'
import { observer } from 'mobx-react'
import { formatDate, capitalize } from '../../../util/functions'

import styles from '../../../styles/VersionPage.module.sass'
import versionStyles from '../../../styles/Version.module.sass'
import versionModalStyles from '../../../styles/VersionModal.module.sass'
import utilStyles from '../../../styles/util.module.sass'

import ClientColumn from './ClientColumn'
import icons from '../../../util/constants/icons'

import Modal from '../../generic/Modal'
import { IFileService } from '../../../services/FileService'
import { UpdateVersionStoreFactory } from '../../../stores/factories/UpdateVersionStoreFactory'
import UpdateVersionModal from './UpdateVersionModal'
import ReleaseModal from './ReleaseModal'
import AreaChart from '../../generic/AreaChart'
import { colors } from '../../../util/constants/styles'
import { MenuProvider, Menu, Item } from 'react-contexify'
import Pushable from '../../generic/Pushable'
import ConfirmDeleteModal from '../../generic/ConfirmDeleteModal'
import { TriggerContext } from '../../contexts/ModalContext'
import PieChart from '../../generic/PieChart'
import { reportTypes, actionColors } from '../../../util/constants/defaults'
import { format } from 'timeago.js'
import Tip from '../../generic/Tip';

const ID = 'edit_version'

interface IParams {
	appId: string
	versionId: string
}

export interface IReleaseVersionEvent extends React.FormEvent<HTMLFormElement> {
	target: EventTarget & {
		elements: {
			password: HTMLInputElement,
		},
	}
}

@observer
export default class VersionPage extends React.Component<RouteComponentProps<IParams>> {
	public readonly state = {
		hasLoaded: false,
	}

	@lazyInject(nameof<IFileService>())
	private readonly fileService: IFileService

	@lazyInject(nameof<IAppsStore>())
	private readonly appsStore: IAppsStore

	@lazyInject(nameof<UpdateVersionStoreFactory>())
	private readonly updateVersionStoreFactory: UpdateVersionStoreFactory

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
	private get createdAt() {
		return this.version && formatDate(new Date(this.version.createdAt))
	}

	@computed
	get reports(): VersionReportModel | null {
		return this.app && this.version && this.app.reports.get(this.version.id) || null
	}

	@computed
	get activity(): Array<ReportModel & { type: string }> | null {
		if (!this.reports) {
			return null
		}

		return reportTypes.flatMap((type) => this.reports![type].map((report: ReportModel) => ({ ...report, type })))
			.sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp))
	}

	@computed
	get groupedReports() {
		if (this.app && this.version) {
			const reports = this.app.groupedReports.get(this.version.id)

			if (reports) {
				return Object.entries(reports).group(([type, reports]) => {
					const data = reports.map(({ timestamp, count }) => {
						return { x: new Date(timestamp), y: count }
					})

					return [type, data]
				})
			}
		}
	}

	@computed
	get usingPieDate() {
		if (this.app && this.version && this.app.usingReports.size) {
			const reports = this.app.usingReports.get(this.version.versionName)

			if (reports) {
				return Object.entries(reports)
					.map(([label, angle]) => ({
						angle,
						label: SystemTypeDisplay[label],
						gradientLabel: label,
					}))
					.filter(({ angle }) => angle)
			}
		}

		return []
	}

	@computed
	get connectedPieData() {
		if (this.app && this.version) {
			const reports = this.app.clientCounters.get(this.version.versionName)

			if (reports) {
				return Object.entries(reports)
					.map(([label, angle]) => ({
						angle,
						label: SystemTypeDisplay[label],
						gradientLabel: label,
					}))
					.filter(({ angle }) => angle)
			}
		}

		return []
	}

	@computed
	get hasReports() {
		return Boolean(this.groupedReports && Object.values(this.groupedReports)
			.reduce((sum, report) => sum + report.length, 0))
	}

	@computed
	get hasAnyColumnReports() {
		return this.reports && Object.values(this.reports)
			.filter((reports) => reports instanceof Array)
			.some((reports) => reports.length)
	}

	public async componentDidMount() {
		if (!this.appsStore.allApps.length) {
			await this.appsStore.fetchApps()
		}

		if (this.app) {
			await this.app.fetchVersions()

			if (this.version) {
				this.app.fetchReports(this.version.id)
				this.app.fetchVersionGroupedReports(this.version.id)
			}

			this.app.fetchAppLiveCount()
			this.app.fetchAppUsingReports()
		}

		this.setState({ hasLoaded: true })
	}

	public render() {
		if (!this.state.hasLoaded) {
			return <Loading />
		}

		if (!this.app) {
			return <Redirect to='/apps' />
		}

		if (!this.version) {
			return <Redirect to={`/apps/${this.app.id}`} />
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
			releasedBy,
			isReleased,
		} = this.version

		const {
			color,
		} = this.app

		return (
			<Container>
				<div className={styles.container}>
					<header style={{ backgroundColor: color }}>
						<img src={this.app.pictureUrl} />
						<h1>{`${this.app.name} v${versionName}`}</h1>
					</header>
					<Flex m x className={styles.tilesContainer}>
						<Flex col list>
							<Flex col m p list className={styles.details}>
								{!isReleased && (
									<>
										<MenuProvider id={ID} event='onClick' style={{ margin: 0 }}>
											<div>
												<Pushable>
													<SVG src={icons.Dots} className={utilStyles.dots} />
												</Pushable>
											</div>
										</MenuProvider>
										<ConfirmDeleteModal name={versionName} onDelete={this.handleDeleteVersion}>
										{(openDelete) => (
											<Modal>
												<Modal.Content
													title={`Edit ${versionName}`}
													className={versionModalStyles.versionModal}
													component={UpdateVersionModal}
													props={{
														store: this.updateVersionStoreFactory(this.app!, this.version!),
													}}
												/>
													<TriggerContext.Consumer>
														{({ open }) => (
															<Menu
																id={ID}
																animation='menu-animation'
																theme='menu-theme'
															>
																<Item onClick={open}>Edit</Item>
																<Item onClick={openDelete}>Delete</Item>
															</Menu>
														)}
													</TriggerContext.Consumer>
											</Modal>
										)}
										</ConfirmDeleteModal>
									</>
								)}
								{createdAt && (
									<Flex list y>
										<label>Added on</label>
										<label className={utilStyles.dark}>
											{this.createdAt}
										</label>
									</Flex>
								)}
								{hash && (
									<Flex list y>
										<label>Hash</label>
										<label className={utilStyles.dark}>{hash}</label>
									</Flex>
								)}
								{description && (
									<Flex list y>
										<label>Description</label>
										<label className={utilStyles.dark}>{description}</label>
									</Flex>
								)}
								<Flex list y>
									<label>Supports</label>
									<Flex list>
										{Object.keys(systems)
											.filter((key) => systems[key])
											.map((key) => <SVG key={key} src={icons[key]} />)
										}
									</Flex>
								</Flex>
								{(isBase || isCritical) && (
									<Flex y spread>
										<label>Tags</label>
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
								)}
								{releasedBy && (
									<Flex spread y>
										<Flex col list>
											<label>Released by</label>
											<label className={utilStyles.dark}>{releasedBy.name}</label>
											<label className={utilStyles.dark}>{releasedBy.email}</label>
										</Flex>
										{releasedBy.pictureUrl && <img src={releasedBy.pictureUrl} />}
									</Flex>
								)}
								<Flex list m x y mta>
									{downloadUrl && (
										<Button color='white' size='small' onClick={this.handleDownload}>
											<SVG src={icons.Download} />
											Download
										</Button>
									)}
									<Modal>
										<Modal.OpenTrigger>
											<Button
												color='blue'
												size='small'
												disabled={isReleased}
											>
												<SVG src={icons.Upload} />
												Release
											</Button>
										</Modal.OpenTrigger>
										<Modal.Content
											title={`Release ${versionName}`}
											component={ReleaseModal}
											props={{
												onSubmit: this.handleRelease,
											}}
										/>
									</Modal>
								</Flex>
								{this.activity && (
									<>
										<label>Activity Log</label>
										{this.activity.map(({ client, type, timestamp }) => (
											<Flex key={client.id + type} className={styles.client} list y>
												<Tip message={capitalize(type)}>
													<SVG
														className={styles.actionType}
														src={icons[capitalize(type)]}
														style={{ backgroundColor: actionColors[type] }}
													/>
												</Tip>
												<h6>
													{format(new Date(timestamp))}
												</h6>
												<h5>{client.username}</h5>
												<Flex grow />
												<label>{client.osRelease}</label>
												<SVG src={icons[client.systemType]} />
											</Flex>
										))}
									</>
								)}
							</Flex>
						</Flex>
						{(this.hasReports || this.hasAnyColumnReports)
							? (
								<Flex grow col className={styles.timeReports}>
									{(this.groupedReports && this.hasReports) && (
										<Flex list col>
											<PieChart
												title='Clients connected on this version per system type'
												data={this.connectedPieData}
											/>
											<PieChart
												title='Clients using this version per system type'
												data={this.usingPieDate}
											/>
											<AreaChart
												title='Clients downloading time reports'
												data={this.groupedReports.downloading}
												color={colors.data.purple}
											/>
											<AreaChart
												title='Clients downloaded time reports'
												data={this.groupedReports.downloaded}
												color={colors.data.green}
											/>
											<AreaChart
												title='Clients using time reports'
												data={this.groupedReports.using}
												color={colors.data.blue}
											/>
											<AreaChart
												title='Clients error time reports'
												data={this.groupedReports.errorMessages}
												color={colors.data.red}
											/>
										</Flex>
									)}
								</Flex>
							)
							: null
						}
					</Flex>
				</div>
			</Container>
		)
	}

	@bind
	private handleRelease(event: IReleaseVersionEvent) {
		event.preventDefault()

		if (this.version && this.app) {
			this.app.releaseUpdate({
				versionId: this.version.id,
				password: event.target.elements.password.value,
			})
		}
	}

	@bind
	private handleDownload() {
		if (this.version && this.version.downloadUrl) {
			this.fileService.downloadFile(this.version.downloadUrl, this.version.versionName || 'app')
		}
	}

	@bind
	private handleDeleteVersion() {
		if (this.version && this.app) {
			const { id } = this.version
			this.app.deleteVersion(id)
		}
	}

}
