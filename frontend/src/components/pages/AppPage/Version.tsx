import React from 'react'
import { VersionModel, SimpleVersionReportModel } from 'shared'
import { observer } from 'mobx-react'
import { ObservableMap, computed } from 'mobx'

import { formatDate } from '../../../util/functions'
import { animated } from 'react-spring'

import Flex from '../../generic/Flex'
import Counter from './Counter'

import styles from '../../../styles/Version.module.sass'
import Pushable from '../../generic/Pushable'
import { BrowserHistory } from '../../../util/types'
import icons from '../../../util/constants/icons'

interface IProps {
	version: VersionModel
	animation: React.CSSProperties
	simpleReports: ObservableMap<string, SimpleVersionReportModel>
	history: BrowserHistory
}

@observer
export default class Version extends React.Component<IProps> {
	public render() {
		const { version, animation } = this.props

		return (
			<animated.div
				className={styles.container}
				style={animation}
				onClick={this.handleClick}
			>
				<Flex pr centerY centerX className={styles.date}>
					{formatDate(new Date(version.createdAt))}
				</Flex>
				<Pushable>
					<Flex list centerY grow className={styles.version}>
						<h3>{version.versionName}</h3>
						{this.simpleReport && (
							<>
								<Counter
									className={styles.counter}
									message='Using'
									icon={icons.Success}
									count={this.simpleReport.usingCount}
								/>
								<Counter
									className={styles.counter}
									message='Downloading'
									icon={icons.Downloading}
									count={this.simpleReport.downloadingCount}
								/>
								<Counter
									className={styles.counter}
									message='Downloaded'
									icon={icons.Downloaded}
									count={this.simpleReport.downloadedCount}
								/>
								<Counter
									className={styles.counter}
									message='Errors'
									icon={icons.ErrorIcon}
									count={this.simpleReport.errorsCount}
								/>
							</>
						)}
						<Flex list centerY right>
							{version && (
								<>
									{version.isBase && (
										<Flex centerY>
											<div className={styles.base} />
											<label>Base</label>
										</Flex>
									)}
									{version.isCritical && (
										<Flex centerY>
											<div className={styles.critical} />
											<label>Critical</label>
										</Flex>
									)}
									{version.systems && (
										<>
											{version.systems.Darwin && <SVG src={icons.Darwin} />}
											{version.systems.Linux && <SVG src={icons.Linux} />}
											{version.systems.Windows_RT && <SVG src={icons.Windows_RT} />}
										</>
									)}
								</>
							)}
						</Flex>
					</Flex>
				</Pushable>
			</animated.div>
		)
	}

	@bind
	private handleClick() {
		this.props.history.push(`${location.pathname}/${this.props.version.id}`)
	}

	@computed
	private get simpleReport(): SimpleVersionReportModel | null {
		return this.props.simpleReports.get(this.props.version.id) || null
	}
}
