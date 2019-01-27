import { computed } from 'mobx'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { Redirect, RouteComponentProps } from 'react-router'

import { IApp } from '../../../stores/App'
import AppsStore from '../../../stores/AppsStore'
import Version from './Version'

import { injectAppsStore } from '../../../stores/RootStore'

import Button from '../../generic/Button'
import Container from '../../generic/Container'
import Loading from '../../generic/Loading'
import Modal from '../../generic/Modal'
import CreateVersionModal from './CreateVersionModal'
import AppearAnimation from '../../generic/AppearAnimation'

import Plus from '../../../img/Plus.svg'

import appsPageStyles from '../../../styles/AppsPage.module.sass'
import styles from '../../../styles/AppPage.module.sass'


interface IParams {
	id: string
}

interface IProps extends RouteComponentProps<IParams> {
	appsStore: AppsStore
}

interface IState {
	hasLoaded: boolean
}

class AppPage extends Component<IProps, IState> {
	public readonly state = {
		hasLoaded: false,
	}

	@computed
	private get app(): IApp | null {
		return this.props.appsStore.getApp(this.props.match.params.id) || null
	}

	public async componentDidMount() {
		if (!this.props.appsStore.allApps.length) {
			await this.props.appsStore.fetchApps()
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
		} = this.app

		return (
			<Container>
				<div className={appsPageStyles.appsPageContainer}>
					<header>
						<h1>{name}</h1>
						<Modal>
							<Modal.OpenTrigger>
								<Button color='blue' noShadow size='small'>
									<SVG src={Plus} />
									Add new version
								</Button>
							</Modal.OpenTrigger>
							<CreateVersionModal app={this.app} />
						</Modal>
					</header>
					<div className={styles.versionContainer}>
						<AppearAnimation items={allVersions}>
							{(version) => (animation) => (
								<Version
									simpleReports={simpleReports}
									version={version}
									animation={animation}
								/>
							)}
						</AppearAnimation>
					</div>
				</div>
			</Container>
		)
	}
}

export default inject(injectAppsStore)(observer(AppPage))
