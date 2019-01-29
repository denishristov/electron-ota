import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { IAppsStore } from '../../../stores/AppsStore'
import { injectAppsStore } from '../../../stores/RootStore'

import App from './App'

import Button from '../../generic/Button'
import Modal from '../../generic/Modal'

import Plus from '../../../img/Plus.svg'

import { RouteComponentProps, StaticContext } from 'react-router'
import Container from '../../generic/Container'
import AppearAnimation from '../../generic/AppearAnimation'
import CreateAppModal from './CreateAppModal'

import styles from '../../../styles/AppsPage.module.sass'

interface IProps extends RouteComponentProps<{}, StaticContext, {}> {
	appsStore: IAppsStore
}

class AppsContainer extends Component<IProps> {
	public componentDidMount() {
		this.props.appsStore.fetchApps()
	}

	public componentDidCatch() {
		if (this.props.location.pathname !== '/apps') {
			this.props.history.push('/apps')
		}
	}

	public render() {
		const { allApps } = this.props.appsStore

		return (
			<Container>
				<div className={styles.appsPageContainer}>
					<header>
						<h1>Apps</h1>
						<Modal>
							<Modal.OpenTrigger>
								<Button color='blue' size='small'>
									<SVG src={Plus} />
									Add new app
								</Button>
							</Modal.OpenTrigger>
							<CreateAppModal />
						</Modal>
					</header>
					<div className={styles.appsContainer}>
						<AppearAnimation items={allApps}>
							{(app) => (animation) => (
								<App
									app={app}
									key={app.id}
									history={this.props.history}
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

export default inject(injectAppsStore)(observer(AppsContainer))
