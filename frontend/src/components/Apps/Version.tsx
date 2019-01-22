import React from 'react'
import { IVersionModel, IVersionReportModel } from 'shared'
import { observer } from 'mobx-react'

import Download from '../../img/Download.svg'
import { downloadFile } from '../../util/functions'
import { animated } from 'react-spring'
import Row from '../Generic/Row'

import Windows from '../../img/Windows.svg'
import Apple from '../../img/Apple.svg'
import Ubuntu from '../../img/Ubuntu.svg'
import { ObservableMap } from 'mobx'

export interface IProps {
	version: IVersionModel
	animation: React.CSSProperties
	simpleReports: ObservableMap<string, IVersionReportModel>
}

function Version({ version, simpleReports, animation }: IProps) {
	const report = simpleReports.get(version.id)

	return (
		<animated.div className='version' style={animation}>
			<h3>{version.versionName}</h3>
			{version.isBase && (
				<Row className='center-y'>
					<div className='base' />
					<label>Base</label>
				</Row>
			)}
			{version.isCritical && (
				<Row className='center-y'>
					<div className='critical' />
					<label>Critical</label>
				</Row>
			)}
			{version.systems.Windows_RT && <SVG src={Windows} />}
			{version.systems.Darwin && <SVG src={Apple} />}
			{version.systems.Linux && <SVG src={Ubuntu} />}
			{new Date(version.createdAt).toLocaleDateString()}
			{report && (
				<Row>
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
				</Row>
			)}
			{/* <label>Hash</label>
			<div>{version.hash}</div>
			<SVG src={Download} onClick={() => downloadFile(version.downloadUrl)} /> */}
		</animated.div>
	)
}

export default observer(Version)
