import React, { version } from 'react'
import Container from '../../generic/Container'

import styles from '../../../styles/VersionPage.module.sass'
import Button from '../../generic/Button'
import Flex from '../../generic/Flex'
import { IVersionModel } from 'shared'
import { RouteComponentProps, Redirect } from 'react-router'
import AppsStore, { IAppsStore } from '../../../stores/AppsStore'
import { computed } from 'mobx'
import { IApp } from '../../../stores/App'
import Loading from '../../generic/Loading'
import { inject, observer } from 'mobx-react'
import { injectAppsStore } from '../../../stores/RootStore'

interface IParams {
	appId: string
	versionId: string
}

interface IProps extends RouteComponentProps<IParams> {
	appsStore: AppsStore
}

class VersionPage extends React.Component<IProps> {
	public readonly state = {
		hasLoaded: false,
	}

	@computed
	private get app(): IApp | null {
		const { appId } = this.props.match.params
		return this.props.appsStore.getApp(appId)
	}

	@computed
	private get version(): IVersionModel | null {
		const { versionId } = this.props.match.params
		return this.app && this.app.getVersion(versionId)
	}

	public async componentDidMount() {
		if (!this.props.appsStore.allApps.length) {
			await this.props.appsStore.fetchApps()
		}

		if (this.app) {
			await this.app.fetchVersions()
		}

		this.setState({ hasLoaded: true })
	}

	public render() {
		if (!this.state.hasLoaded || !this.version) {
			return <Loading />
		}

		if (!this.app) {
			return <Redirect to='/apps' />
		}

		return (
			<Container>
				<div className={styles.container}>
					<header>
						<h1>{this.version.versionName}</h1>
						{/* <Modal> */}
							<Button color='blue' size='small' onClick={this.handleRelease}>
								Release
							</Button>
							{/* </Modal.OpenTrigger>
							<CreateAppModal />
						</Modal> */}
					</header>
					<Flex>
						{JSON.stringify(this.version)}
					</Flex>
				</div>
			</Container>
		)
	}

	@bind
	private handleRelease() {
		this.version && this.props.appsStore.emitPublishVersion({ versionId: this.version.id })
	}
}

export default inject(injectAppsStore)(observer(VersionPage))
