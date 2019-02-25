import React from 'react'
import Flex from '../../generic/Flex'
import styles from '../../../styles/VersionPage.module.sass'
import { observer } from 'mobx-react'
import Report from './Report'
import { ReportModel } from 'shared'

interface IProps {
	reports: ReportModel[]
	title: string
	icon: string
	color: string
}

export default observer(function ClientRow({ reports, title, icon, color }: IProps) {
	return reports ? (
		<Flex col grow className={styles.reportColumn}>
			<Flex p spread style={{ backgroundColor: color }}>
				<Flex>
					<h3>{title}</h3>
					<SVG src={icon} />
				</Flex>
				<h4>{reports.length}</h4>
			</Flex>
			<Flex col>
				{reports.map((report) => <Report key={report.client.id} {...report} />)}
			</Flex>
		</Flex>
	)
	: null
})
