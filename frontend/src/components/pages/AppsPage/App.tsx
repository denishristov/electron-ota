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
import { colors } from '../../../util/constants/styles'

interface IProps extends IAnimatable {
	app: IApp
	history: BrowserHistory
}

@observer
export default class App extends Component<IProps> {
	public render() {
		const {
			name,
			bundleId,
			pictureUrl,
			latestVersions,
			versionsCount,
			versions,
			color,
		} = this.props.app

		return (
			<Pushable>
				<animated.div
					className={styles.appTile}
					onClick={this.goToApp}
					style={this.props.animation}
				>
				<Flex y list mb style={{ backgroundColor: color || colors.accent }}>
					{pictureUrl && <img src={pictureUrl} />}
					<h3>{name}</h3>
				</Flex>
					<Flex list col>
						<Flex y list>
							<label>Bundle ID</label>
							<label className={utilStyles.dark}>{bundleId}</label>
						</Flex>
						<Flex y list>
							<label>Versions added </label>
							<label className={utilStyles.dark}>{versions.size || versionsCount}</label>
						</Flex>
						<label>Latest versions</label>
						{latestVersions && Object.entries(latestVersions).map(([systemType, version]) => version && (
							<Flex y list key={systemType}>
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
