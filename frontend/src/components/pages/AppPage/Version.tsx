import React from 'react'
import { IVersionModel, ISimpleVersionReportModel } from 'shared'
import { observer } from 'mobx-react'
import { ObservableMap, computed } from 'mobx'

import { formatDate } from '../../../util/functions'
import { animated } from 'react-spring'

import Flex from '../../generic/Flex'
import Counter from './Counter'

import Windows from '../../../img/Windows.svg'
import Apple from '../../../img/Apple.svg'
import Ubuntu from '../../../img/Ubuntu.svg'
import Download from '../../../img/Download.svg'
import Downloading from '../../../img/Downloading.svg'
import Success from '../../../img/Success.svg'
import ErrorIcon from '../../../img/Error.svg'

import styles from '../../../styles/Version.module.sass'
import Pushable from '../../generic/Pushable'
import { BrowserHistory } from '../../../util/types'

interface IProps {
	version: IVersionModel
	animation: React.CSSProperties
	simpleReports: ObservableMap<string, ISimpleVersionReportModel>
	history: BrowserHistory
}

@observer
export default class Version extends React.Component<IProps> {
	public render() {
		const { version, animation } = this.props

		return (
			<Pushable>
				<animated.div
					className={styles.version}
					style={animation}
					onClick={this.handleClick}
				>
					<Flex list centerY grow>
						<h3>{version.versionName}</h3>
						{this.simpleReport && (
							<>
								<Counter
									className={styles.counter}
									message='Downloading'
									icon={Downloading}
									count={this.simpleReport.downloadingCount}
								/>
								<Counter
									className={styles.counter}
									message='Downloaded'
									icon={Download}
									count={this.simpleReport.downloadedCount}
								/>
								<Counter
									className={styles.counter}
									message='Using'
									icon={Success}
									count={this.simpleReport.usingCount}
								/>
								<Counter
									className={styles.counter}
									message='Errors'
									icon={ErrorIcon}
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
											{version.systems.Darwin && <SVG src={Apple} />}
											{version.systems.Linux && <SVG src={Ubuntu} />}
											{version.systems.Windows_RT && <SVG src={Windows} />}
										</>
									)}
								</>
							)}
						</Flex>
					</Flex>
					<Flex pr centerX centerY className={styles.date}>
						{formatDate(new Date(version.createdAt))}
					</Flex>
				</animated.div>
			</Pushable>
		)
	}

	@bind
	private handleClick() {
		this.props.history.push(`${location.pathname}/${this.props.version.id}`)
	}

	@computed
	private get simpleReport(): ISimpleVersionReportModel | null {
		return this.props.simpleReports.get(this.props.version.id) || null
	}
}
