import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { IAppModel } from 'shared'
import AppsStore from '../../stores/AppsStore'
import { injectAppsStore } from '../../stores/RootStore'
import { RouterProps } from 'react-router'
import Flex from '../Generic/Flex'
import { IAnimatable } from '../../util/types'
import { animated } from 'react-spring'

import styles from '../../styles/App.module.sass'
import indexStyles from '../../index.module.sass'

interface IProps extends RouterProps, IAnimatable {
	app: IAppModel
	appsStore: AppsStore
}

class App extends Component<IProps> {
	@bind
	public handleDeleteApp() {
		const { appsStore, app } = this.props

		appsStore.emitDeleteApp({ id: app.id })
	}

	public render() {
		const {
			name,
			bundleId,
			pictureUrl,
			latestVersion,
			versions,
		} = this.props.app

		return (
			<animated.div
				className={styles.appTile}
				onClick={this.goToApp}
				style={this.props.animation}
			>
				<Flex centerY>
					<img src={pictureUrl} />
					<h3 className={indexStyles.textOverflow}>{name}</h3>
				</Flex>
				<label>{`Bundle ID ${bundleId}`}</label>
				<label>{`Versions ${versions}`}</label>
				<label>{`Latest version ${latestVersion}`}</label>
			</animated.div>
		)
	}

	@bind
	private goToApp() {
		this.props.history.push(`/apps/${this.props.app.id}`)
	}
}

export default inject(injectAppsStore)(observer(App))
