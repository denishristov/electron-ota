import { observer } from 'mobx-react'
import React, { Component } from 'react'

import Flex from '../../generic/Flex'
import { IAnimatable, BrowserHistory } from '../../../util/types'
import { animated } from 'react-spring'

import styles from '../../../styles/App.module.sass'
import utilStyles from '../../../styles/util.module.sass'

import { IApp } from '../../../stores/App'
import Pushable from '../../generic/Pushable'
import icons from '../../../util/constants/icons'
import { formatDate } from '../../../util/functions'
import { Placeholder } from '../../../util/constants/defaults'
import Modal from '../../generic/Modal'
import AppModal from '../../modals/AppModal'

interface IProps extends IAnimatable {
	app: IApp | Placeholder
	history: BrowserHistory
}

@observer
export default class App extends Component<IProps> {
	public render() {
		if (this.props.app instanceof Placeholder) {
			return (
				<Pushable>
					<animated.div className={styles.appTile} style={this.props.animation}>
						<Modal>
							<Modal.OpenTrigger>
								<Flex grow centerY centerX list className={styles.placeholder}>
									<SVG src={icons.Plus} />
									<h4>Add a new app</h4>
								</Flex>
							</Modal.OpenTrigger>
							<Modal.Content title='Add a new app' component={AppModal} props={{}} />
						</Modal>
					</animated.div>
				</Pushable>
			)
		}

		const {
			name,
			bundleId,
			pictureUrl,
			latestVersions,
			versionsCount,
			versions,
		} = this.props.app

		return (
			<Pushable>
				<animated.div
					className={styles.appTile}
					onClick={this.goToApp}
					style={this.props.animation}
				>
					<img src={pictureUrl} />
					<Flex className={styles.header}>
						<h3>{name}</h3>
					</Flex>
					<Flex list column>
						<Flex centerY list>
							<label>Bundle ID</label>
							<label className={utilStyles.dark}>{bundleId}</label>
						</Flex>
						<Flex centerY list>
							<label>Versions added </label>
							<label className={utilStyles.dark}>{versions.size || versionsCount}</label>
						</Flex>
						<label>Latest versions</label>
						{latestVersions && Object.entries(latestVersions).map(([systemType, version]) => version && (
							<Flex centerY list key={systemType}>
								<label className={utilStyles.dark}>{version.versionName}</label>
								<SVG src={icons[systemType]} />
								<label>{formatDate(new Date(version.createdAt))}</label>
							</Flex>
						))}
					</Flex>
				</animated.div>
			</Pushable>
		)
	}

	@bind
	private goToApp() {
		this.props.history.push(`/apps/${this.props.app.id}`)
	}
}
