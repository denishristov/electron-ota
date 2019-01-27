import React from 'react'
import { IVersionModel, IVersionReportModel } from 'shared'
import { observer } from 'mobx-react'
import { ObservableMap } from 'mobx'

import { formatDate } from '../../util/functions'
import { animated } from 'react-spring'
import Flex from '../Generic/Flex'

import Windows from '../../img/Windows.svg'
import Apple from '../../img/Apple.svg'
import Ubuntu from '../../img/Ubuntu.svg'
import Download from '../../img/Download.svg'
import Downloading from '../../img/Downloading.svg'
import Success from '../../img/Success.svg'
import ErrorIcon from '../../img/Error.svg'

import styles from '../../styles/Version.module.sass'
import Counter from '../AppsPage/Counter'
import { ClassName } from '../../util/types'

export interface IProps {
	version: IVersionModel
	animation: React.CSSProperties
	simpleReports: ObservableMap<string, IVersionReportModel>
}

function Version({ version, simpleReports, animation }: IProps) {
	const report = simpleReports.get(version.id)

	return (
		<animated.div className={styles.version} style={animation}>
			<Flex list centerY grow>
				<h3>{version.versionName}</h3>
				<h4>
					{formatDate(new Date(version.createdAt))}
				</h4>
				{report && (
					<>
						<Counter
							className={styles.counter}
							message='Downloading'
							icon={Downloading}
							count={report.downloadingCount}
						/>
						<Counter
							className={styles.counter}
							message='Downloaded'
							icon={Download}
							count={report.downloadedCount}
						/>
						<Counter
							className={styles.counter}
							message='Using'
							icon={Success}
							count={report.usingCount}
						/>
						<Counter
							className={styles.counter}
							message='Errors'
							icon={ErrorIcon}
							count={report.errorsCount}
						/>
					</>
				)}
				<Flex list centerY right>
				{version && [
					version.isBase && (
						<Flex centerY>
							<div className={styles.base} />
							<label>Base</label>
						</Flex>
					),
					version.isCritical && (
						<Flex centerY>
							<div className={styles.critical} />
							<label>Critical</label>
						</Flex>
					),
					version.systems && [
						version.systems.Darwin && <SVG src={Apple} />,
						version.systems.Linux && <SVG src={Ubuntu} />,
						version.systems.Windows_RT && <SVG src={Windows} />,
					],
				]}
				</Flex>
			</Flex>
		</animated.div>
	)
}

export default observer(Version)
