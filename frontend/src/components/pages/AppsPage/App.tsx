import { observer } from 'mobx-react'
import React, { Component } from 'react'

import Flex from '../../generic/Flex'
import { IAnimatable, BrowserHistory } from '../../../util/types'
import { animated } from 'react-spring'

import styles from '../../../styles/App.module.sass'
import { IApp } from '../../../stores/App'
import Pushable from '../../generic/Pushable'

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
			latestVersion,
			versions,
		} = this.props.app

		return (
			<Pushable>
				<animated.div
					className={styles.appTile}
					onClick={this.goToApp}
					style={this.props.animation}
				>
					<Flex centerY mb>
						<img src={pictureUrl} />
						<h3>{name}</h3>
					</Flex>
					<label>{`Bundle ID ${bundleId}`}</label>
					<label>{`Versions ${versions}`}</label>
					<label>{`Latest version ${latestVersion}`}</label>
				</animated.div>
			</Pushable>
		)
	}

	@bind
	private goToApp() {
		this.props.history.push(`/apps/${this.props.app.id}`)
	}
}
