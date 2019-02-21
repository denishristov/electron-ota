import { computed } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { Redirect, RouteComponentProps } from 'react-router'

import { IApp } from '../../../stores/App'
import { IAppsStore } from '../../../stores/AppsStore'
import Version from './Version'

import Container from '../../generic/Container'
import Loading from '../../generic/Loading'
import Modal from '../../generic/Modal'
import VersionModal from './CreateVersionModal'
import AppearAnimation from '../../generic/AppearAnimation'
import Flex from '../../generic/Flex'

import Plus from '../../../img/Plus.svg'

import styles from '../../../styles/AppPage.module.sass'
import utilStyles from '../../../styles/util.module.sass'

import versionModalStyles from '../../../styles/VersionModal.module.sass'
import versionStyles from '../../../styles/Version.module.sass'

import { list, formatDate } from '../../../util/functions'
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

	@computed
	private get app(): IApp | null {
		const app = this.appsStore.getApp(this.props.match.params.appId)

		return app
	}

	@computed
	private get liveCountPieData() {
		if (this.app) {
			const data = Object.entries({ ...defaultSystemCounts }).group((x) => x)

			for (const { Darwin, Linux, Windows_RT } of [...this.app.clientCounters.values()]) {
				data.Darwin += Darwin
				data.Linux += Linux
				data.Windows_RT += Windows_RT
			}

			return Object.entries(data)
				.map(([label, angle]) => ({ angle, label, gradientLabel: label }))
				.filter(({ angle }) => angle)
		}
	}
	public readonly state = {
		hasLoaded: false,
		isModalClosingDisabled: false,
	}

	@DI.lazyInject(DI.Stores.Apps)
	private readonly appsStore: IAppsStore

	@DI.lazyInject(DI.Factories.CreateVersionStore)
	private readonly createVersionStoreFactory: CreateVersionStoreFactory

	public async componentDidMount() {
		if (!this.appsStore.allApps.length) {
			await this.appsStore.fetchApps()
		}

		if (this.app) {
			this.app.fetchVersions()
			this.app.fetchSimpleReports()
			this.app.fetchAppLiveCount()
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
									<label className={utilStyles.dark}>{bundleId}</label>
								</Flex>
								<MenuProvider id={ID} event='onClick' style={{ margin: 0 }}>
									<div>
										<Pushable>
											<SVG src={icons.Dots} className={styles.dots} />
										</Pushable>
									</div>
								</MenuProvider>
								<Flex y list>
									<label>Versions added</label>
									<label className={utilStyles.dark}>{versions.size || versionsCount}</label>
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
														Add new version
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
						<Flex col list m>
							<PieChart
								data={this.liveCountPieData}
								title='Live count data'
							/>
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
