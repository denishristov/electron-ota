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
import { gradient } from '../../../util/functions'
import { format } from 'timeago.js'
import { colors } from '../../../util/constants/styles'
import { ISystemTypeCount } from 'shared'

interface IProps extends IAnimatable {
	app: IApp
	history: BrowserHistory
	clients?: ISystemTypeCount
}

@observer
export default class App extends Component<IProps> {
	public render() {
		const { clients } = this.props
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
				<div className={styles.container}>
					<animated.div
						onClick={this.goToApp}
						style={this.props.animation}
						className={styles.appTile}
					>
						<Flex y list mb style={gradient(color || colors.ui.accent)}>
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
							{latestVersions && (
								<>
									<label>Latest versions and connected clients</label>
									{Object.entries(latestVersions).map(([systemType, version]) => version && (
										<Flex y list key={systemType}>
											<SVG src={icons[systemType]} />
											<label className={utilStyles.dark}>{version.versionName}</label>
											<label className={utilStyles.dark}>{format(new Date(version.createdAt))}</label>
											{clients && (
												<label className={utilStyles.dark}>
													{clients[systemType]} total clients
												</label>
											)}
										</Flex>
									))}
								</>
							)}
						</Flex>
					</animated.div>
				</div>
			</Pushable>
		)
	}

	@bind
	private goToApp() {
		this.props.history.push(`/apps/${this.props.app.id}`)
	}
}
