import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { IAppsStore } from '../../../stores/AppsStore'

import App from './App'
import Modal from '../../generic/Modal'

import { RouteComponentProps } from 'react-router'
import Container from '../../generic/Container'
import AppearAnimation from '../../generic/AppearAnimation'
import AppModal from './CreateAppModal'

import styles from '../../../styles/AppsPage.module.sass'

import icons from '../../../util/constants/icons'
import Button from '../../generic/Button'

@observer
export default class AppsContainer extends Component<RouteComponentProps> {
	@lazyInject(nameof<IAppsStore>())
	private readonly appsStore: IAppsStore

	public componentDidMount() {
		this.appsStore.fetchApps()
	}

	public componentDidCatch() {
		if (this.props.location.pathname !== '/apps') {
			this.props.history.push('/apps')
		}
	}

	public render() {
		const { allApps } = this.appsStore

		return (
			<Container>
				<div className={styles.appsPageContainer}>
					<header>
						<h1>Apps</h1>
						<Modal>
							<Modal.OpenTrigger>
								<div>
									<Button color='white' size='small'>
										<SVG src={icons.Plus} />
										Add app
									</Button>
								</div>
							</Modal.OpenTrigger>
							<Modal.Content title='Add a new app' component={<AppModal />} />
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
					{/* <Pushable>
						<div className={styles.placeholder}>
						</div>
					</Pushable> */}
					</div>
				</div>
			</Container>
		)
	}
}
