import { computed } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { Redirect, RouteComponentProps } from 'react-router'

import { IApp } from '../../../stores/App'
import { IAppsStore } from '../../../stores/AppsStore'
import Version from './Version'

import Container from '../../generic/Container'
import Loading from '../../generic/LoadingContainer'
import Modal from '../../generic/Modal'
import VersionModal from './CreateVersionModal'
import AppearAnimation from '../../generic/AppearAnimation'
import Flex from '../../generic/Flex'

import Plus from '../../../img/Plus.svg'

import styles from '../../../styles/AppPage.module.sass'
import utilStyles from '../../../styles/util.module.sass'

import versionModalStyles from '../../../styles/VersionModal.module.sass'
import versionStyles from '../../../styles/Version.module.sass'

import { list, formatDate, returnArgument } from '../../../util/functions'
import Pushable from '../../generic/Pushable'
import { CreateVersionStoreFactory } from '../../../stores/factories/CreateVersionStoreFactory'
import icons from '../../../util/constants/icons'
import { MenuProvider, Menu, Item, Separator } from 'react-contexify'
import UpdateAppModal from './UpdateAppModal'
import { TriggerContext } from '../../contexts/ModalContext'
import ConfirmDeleteModal from '../../generic/ConfirmDeleteModal'
import { defaultSystemCounts } from '../../../util/constants/defaults'
import PieChart from '../../generic/PieChart'
import Button from '../../generic/Button'
import BarChart, { IBarChartSystemTypeData } from '../../generic/BarChart'
import { SystemType, SystemTypeDisplay } from 'shared'

const ID = 'edit_app'
interface IParams {
	appId: string
}

interface IState {
	hasLoaded: boolean
	isModalClosingDisabled: boolean
}

@observer
export default class AppPage extends Component<RouteComponentProps<IParams>, IState> {
	public readonly state = {
		hasLoaded: false,
		isModalClosingDisabled: false,
	}

	@lazyInject(nameof<IAppsStore>())
	private readonly appsStore: IAppsStore

	@lazyInject(nameof<CreateVersionStoreFactory>())
	private readonly createVersionStoreFactory: CreateVersionStoreFactory

	@computed({ keepAlive: true })
	private get app(): IApp | null {
		const app = this.appsStore.getApp(this.props.match.params.appId)

		return app
	}

	@computed({ keepAlive: true })
	private get liveClientsPieData() {
		if (this.app) {
			const data = Object.entries({ ...defaultSystemCounts }).group(returnArgument)

			for (const { Darwin, Linux, Windows_NT } of [...this.app.clientCounters.values()]) {
				data.Darwin += Darwin
				data.Linux += Linux
				data.Windows_NT += Windows_NT
			}

			return Object.entries(data)
				.map(([label, angle]) => ({
					angle,
					label: SystemTypeDisplay[label],
					gradientLabel: label,
				}))
				.filter(({ angle }) => angle)
		}
	}

	@computed({ keepAlive: true })
	private get appUsingPieData() {
		if (this.app) {
			const data = Object.entries({ ...defaultSystemCounts }).group(returnArgument)

			for (const { Darwin, Linux, Windows_NT } of [...this.app.usingReports.values()]) {
				data.Darwin += Darwin
				data.Linux += Linux
				data.Windows_NT += Windows_NT
			}

			return Object.entries(data)
				.map(([label, angle]) => ({
					angle,
					label: SystemTypeDisplay[label],
					gradientLabel: label,
				}))
				.filter(({ angle }) => angle)
		}
	}

	@computed({ keepAlive: true })
	private get usingReportsBarData() {
		if (this.app) {
			const data: IBarChartSystemTypeData = Object.values(SystemType).group((x) => [x, []])

			for (const [versionName, systemTypeReports] of [...this.app.usingReports.entries()]) {
				for (const systemType of Object.keys(SystemType)) {
					const x = systemTypeReports[systemType]

					x && data[systemType].push({
						x,
						y: versionName,
					})
				}
			}

			return Object.entries(data).filter(([_, data]) => data.length).group(returnArgument)
		}
	}

	@computed({ keepAlive: true })
	private get liveClientsBarData() {
		if (this.app) {
			const data: IBarChartSystemTypeData = Object.values(SystemType).group((x) => [x, []])

			for (const [versionName, systemTypeReports] of [...this.app.clientCounters.entries()]) {
				for (const systemType of Object.keys(SystemType)) {
					const x = systemTypeReports[systemType]

					x && data[systemType].push({
						x,
						y: versionName,
					})
				}
			}

			return Object.entries(data).filter(([_, data]) => data.length).group(returnArgument)
		}
	}

	public async componentDidMount() {
		if (!this.appsStore.allApps.length) {
			await this.appsStore.fetchApps()
		}

		if (this.app) {
			this.app.fetchVersions()
			this.app.fetchSimpleReports()
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

		const {
			id,
			name,
			allVersions,
			simpleReports,
			pictureUrl,
			latestAddedVersion,
			clientCounters,
			latestVersions,
			bundleId,
			versions,
			versionsCount,
			color,
		} = this.app

		const {
			isModalClosingDisabled,
		} = this.state

		return (
			<Container>
				<div className={styles.appPageContainer}>
					<header style={{ backgroundColor: color }}>
						{pictureUrl && <img src={pictureUrl} />}
						<h1>{name}</h1>
					</header>
					<Flex grow x>
						<Flex col m p className={styles.versionsTile}>
							<Flex list col>
								<Flex y list>
									<label>Bundle ID</label>
									<label className={utilStyles.dark}>
										{bundleId}
									</label>
								</Flex>
								<MenuProvider id={ID} event='onClick' style={{ margin: 0 }}>
									<div>
										<Pushable>
											<SVG src={icons.Dots} className={utilStyles.dots} />
										</Pushable>
									</div>
								</MenuProvider>
								<Flex y list>
									<label>Versions added</label>
									<label className={utilStyles.dark}>
										{versions.size || versionsCount}
									</label>
								</Flex>
								<label>Latest versions</label>
								{latestVersions && Object.entries(latestVersions)
									.map(([systemType, version]) => version && (
										<Flex y list key={systemType}>
											<SVG src={icons[systemType]} />
											<label className={utilStyles.dark}>
												{version.versionName}
											</label>
											<label>{formatDate(new Date(version.createdAt))}</label>
										</Flex>
									))
								}
								<ConfirmDeleteModal name={name} onDelete={this.handleDeleteApp}>
								{(openDelete) => (
									<Modal>
										<Modal.Content
											title={`Edit ${name}`}
											component={UpdateAppModal}
											props={{ id, pictureSrc: pictureUrl, name }}
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
							</Flex>
							<Flex col y className={styles.versionsContainer}>
								<Modal disableClose={isModalClosingDisabled}>
									<Pushable>
										<div className={versionStyles.version}>
											<Modal.OpenTrigger>
												<Flex y list grow className={styles.newVersion}>
													<SVG src={Plus} />
													<h3>
														Add a new version
													</h3>
												</Flex>
											</Modal.OpenTrigger>
										</div>
									</Pushable>
									<Modal.Content
										title='Add a new version'
										className={list(
											versionModalStyles.versionModal,
											isModalClosingDisabled && versionModalStyles.disabled,
										)}
										component={VersionModal}
										props={{
											store: this.createVersionStoreFactory(
												this.app,
												latestAddedVersion && latestAddedVersion.versionName,
											),
											toggleClosing: this.toggleClosing,
										}}
									/>
								</Modal>
								<AppearAnimation items={allVersions}>
									{(version) => (animation) => (
										<Version
											simpleReports={simpleReports}
											version={version}
											animation={animation}
											liveCounters={clientCounters}
											history={this.props.history}
										/>
									)}
								</AppearAnimation>
							</Flex>
						</Flex>
						<Flex m className={styles.appReports}>
							<Flex col list>
								<PieChart
									title='Connected clients per system type'
									data={this.liveClientsPieData}
								/>
								<BarChart
									title="Connected clients' version per system type"
									data={this.liveClientsBarData}
								/>
							</Flex>
							<Flex col list>
								<PieChart
									title="Clients' per system type"
									data={this.appUsingPieData}
								/>
								<BarChart
									title="Clients' version per system type"
									data={this.usingReportsBarData}
								/>
							</Flex>
						</Flex>
					</Flex>
				</div>
			</Container>
		)
	}

	@bind
	private handleDeleteApp() {
		if (this.app) {
			const { id } = this.app
			this.appsStore.deleteApp({ id })
		}
	}

	@bind
	private toggleClosing() {
		this.setState({ isModalClosingDisabled: !this.state.isModalClosingDisabled })
	}
}
