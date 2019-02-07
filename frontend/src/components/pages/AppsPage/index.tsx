import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { IAppsStore } from '../../../stores/AppsStore'

import App from './App'
import Button from '../../generic/Button'
import Modal from '../../generic/Modal'

import { RouteComponentProps } from 'react-router'
import Container from '../../generic/Container'
import AppearAnimation from '../../generic/AppearAnimation'
import AppModal from '../../modals/AppModal'

import styles from '../../../styles/AppsPage.module.sass'
import icons from '../../../util/constants/icons'
import { placeholder } from '../../../util/constants/defaults'
import Profile from './Profile'

@observer
export default class AppsContainer extends Component<RouteComponentProps> {
	@DI.lazyInject(DI.Stores.Apps)
	private readonly appsStore!: IAppsStore

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
						{/* <Modal>
							<Modal.OpenTrigger>
								<Button color='blue' size='small'>
									<SVG src={icons.Plus} />
									Add new app
								</Button>
							</Modal.OpenTrigger>
							<Modal.Content title='Add a new app' component={AppModal} props={{}} />
						</Modal> */}
						<Profile />
					</header>
					<div className={styles.appsContainer}>
						<AppearAnimation items={[...allApps, placeholder]}>
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
