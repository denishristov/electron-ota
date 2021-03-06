import React from 'react'
import { VersionModel, SimpleVersionReportModel, ISystemTypeCount } from 'shared'
import { observer } from 'mobx-react'
import { ObservableMap, computed } from 'mobx'

import { formatDate, list } from '../../../util/functions'
import { animated } from 'react-spring'
import { format } from 'timeago.js'

import Flex from '../../generic/Flex'
import Counter from './Counter'

import styles from '../../../styles/Version.module.sass'
import Pushable from '../../generic/Pushable'
import { BrowserHistory } from '../../../util/types'
import icons from '../../../util/constants/icons'
import Tip from '../../generic/Tip'
import { colors } from '../../../util/constants/styles'

interface IProps {
	version: VersionModel
	animation: React.CSSProperties
	simpleReports: ObservableMap<string, SimpleVersionReportModel>
	liveCounters: ObservableMap<string, ISystemTypeCount>
	history: BrowserHistory
}

@observer
export default class Version extends React.Component<IProps> {
	public render() {
		const { version, animation } = this.props
		const [date, ago] = this.dates

		return (
			<animated.div
				className={styles.container}
				style={animation}
				onClick={this.handleClick}
			>
				<Flex pr y x className={styles.date}>
					<Tip message={date}>
						{ago}
					</Tip>
				</Flex>
				<Pushable>
					<Flex list y grow className={styles.version}>
						<h3>{version.versionName}</h3>
						{this.simpleReport && (
							<>
								<Counter
									message='Connected'
									icon={icons.User}
									count={this.liveCount}
									color={colors.data.orange}
								/>
								<Counter
									message='Using'
									icon={icons.Using}
									count={this.simpleReport.usingCount}
									color={colors.data.blue}
								/>
								<Counter
									message='Downloading'
									icon={icons.Downloading}
									count={this.simpleReport.downloadingCount}
									color={colors.data.purple}
								/>
								<Counter
									message='Downloaded'
									icon={icons.Downloaded}
									count={this.simpleReport.downloadedCount}
									color={colors.data.green}
								/>
								<Counter
									message='Errors'
									icon={icons.ErrorMessages}
									count={this.simpleReport.errorsCount}
									color={colors.data.red}
								/>
							</>
						)}
						<Flex y mla>
							{version.isCritical && (
								<Tip message='Critical release'>
									<div className={styles.critical} />
								</Tip>
							)}
							{version.isBase && (
								<Tip message='Base release'>
									<div className={styles.base} />
								</Tip>
							)}
							{version.isReleased && (
								<Tip message='Released'>
									<div className={styles.released} />
								</Tip>
							)}
							{version.systems && (
								<>
									{version.systems.Darwin && <SVG src={icons.Darwin} />}
									{version.systems.Linux && <SVG src={icons.Linux} />}
									{version.systems.Windows_NT && <SVG src={icons.Windows_NT} />}
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

	@computed({ keepAlive: true })
	private get dates() {
		const { version } = this.props
		const date = new Date(version.createdAt)

		return [
			formatDate(date),
			format(date),
		]
	}

	@computed({ keepAlive: true })
	private get simpleReport(): SimpleVersionReportModel | null {
		return this.props.simpleReports.get(this.props.version.id) || null
	}

	@computed({ keepAlive: true })
	private get liveCount(): number {
		const { versionName } = this.props.version
		const counter = this.props.liveCounters.get(versionName)

		if (counter) {
			const { Windows_NT, Darwin, Linux } = counter
			return Windows_NT + Darwin + Linux
		}

		return 0
	}
}
