import React from 'react'
import { IVersionModel, IVersionReportModel } from 'shared'
import { observer } from 'mobx-react'

import Download from '../../img/Download.svg'
import { downloadFile } from '../../util/functions'
import { animated } from 'react-spring'
import Flex from '../Generic/Flex'

import Windows from '../../img/Windows.svg'
import Apple from '../../img/Apple.svg'
import Ubuntu from '../../img/Ubuntu.svg'
import { ObservableMap } from 'mobx'

import indexStyles from '../../index.module.sass'
import styles from '../../styles/Version.module.sass'

export interface IProps {
	version: IVersionModel
	animation: React.CSSProperties
	simpleReports: ObservableMap<string, IVersionReportModel>
}

function Version({ version, simpleReports, animation }: IProps) {
	const report = simpleReports.get(version.id)

	return (
		<animated.div className={styles.version} style={animation}>
			<h3>{version.versionName}</h3>
			{version.isBase && (
				<Flex className={indexStyles.centerY}>
					<div className={styles.base} />
					<label>Base</label>
				</Flex>
			)}
			{version.isCritical && (
				<Flex className={indexStyles.centerY}>
					<div className={styles.critical} />
					<label>Critical</label>
				</Flex>
			)}
			{version.systems.Windows_RT && <SVG src={Windows} />}
			{version.systems.Darwin && <SVG src={Apple} />}
			{version.systems.Linux && <SVG src={Ubuntu} />}
			{new Date(version.createdAt).toLocaleDateString()}
			{report && (
				<Flex>
					<label>Downloading</label>
					<div>
						{report.downloadingCount}
					</div>
					<label>Downloaded</label>
					<div>
						{report.downloadedCount}
					</div>
					<label>Using</label>
					<div>
						{report.usingCount}
					</div>
					<label>Error</label>
					<div>
						{report.errorsCount}
					</div>
				</Flex>
			)}
			{/* <label>Hash</label>
			<div>{version.hash}</div>
			<SVG src={Download} onClick={() => downloadFile(version.downloadUrl)} /> */}
		</animated.div>
	)
}

export default observer(Version)
