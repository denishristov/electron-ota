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

import Plus from '../../../img/Plus.svg'

import styles from '../../../styles/AppPage.module.sass'

interface IParams {
	appId: string
}

interface IState {
	hasLoaded: boolean
}

@observer
export default class AppPage extends Component<RouteComponentProps<IParams>, IState> {
	public readonly state = {
		hasLoaded: false,
	}

	@DI.lazyInject(DI.Stores.Apps)
	private readonly appsStore!: IAppsStore

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
		} = this.app

		return (
			<Container>
				<div className={styles.appPageContainer}>
					<header>
						<img src={pictureUrl} />
						<h1>{name}</h1>
						<Modal>
							<Modal.OpenTrigger>
								<Button color='blue' size='small'>
									<SVG src={Plus} />
									Add new version
								</Button>
							</Modal.OpenTrigger>
							<VersionModal app={this.app} />
						</Modal>
					</header>
					<div className={styles.versionContainer}>
						<AppearAnimation items={allVersions}>
							{(version) => (animation) => (
								<Version
									simpleReports={simpleReports}
									version={version}
									animation={animation}
									history={this.props.history}
								/>
							)}
						</AppearAnimation>
					</div>
				</div>
			</Container>
		)
	}
}
