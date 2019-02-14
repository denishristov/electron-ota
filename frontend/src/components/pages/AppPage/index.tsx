import { computed } from 'mobx'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { Redirect, RouteComponentProps } from 'react-router'

import { IApp } from '../../../stores/App'
import { IAppsStore } from '../../../stores/AppsStore'
import Version from './Version'

import Button from '../../generic/Button'
import Container from '../../generic/Container'
import Loading from '../../generic/Loading'
import Modal from '../../generic/Modal'
import VersionModal from '../../modals/VersionModal'
import AppearAnimation from '../../generic/AppearAnimation'
import Flex from '../../generic/Flex'

import Plus from '../../../img/Plus.svg'

import styles from '../../../styles/AppPage.module.sass'
import versionModalStyles from '../../../styles/VersionModal.module.sass'
import versionStyles from '../../../styles/Version.module.sass'

import { list } from '../../../util/functions'
import Pushable from '../../generic/Pushable'

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

	@DI.lazyInject(DI.Stores.Apps)
	private readonly appsStore: IAppsStore

	@computed
	private get app(): IApp | null {
		const app = this.appsStore.getApp(this.props.match.params.appId)

		return app
	}

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
			name,
			allVersions,
			simpleReports,
			pictureUrl,
			latestAddedVersion,
			clientCounters,
		} = this.app

		const {
			isModalClosingDisabled,
		} = this.state

		return (
			<Container>
				<div className={styles.appPageContainer}>
					<header>
						<img src={pictureUrl} />
						<h1>{name}</h1>
					</header>
					<Flex grow>
						<Flex col m y className={styles.versionsContainer}>
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
										app: this.app,
										previousVersionName: latestAddedVersion && latestAddedVersion.versionName,
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
						<Flex col grow m y>
						</Flex>
					</Flex>
				</div>
			</Container>
		)
	}

	@bind
	private toggleClosing() {
		this.setState({ isModalClosingDisabled: !this.state.isModalClosingDisabled })
	}
}
