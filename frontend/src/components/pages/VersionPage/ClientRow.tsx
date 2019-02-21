import React from 'react'
import Flex from '../../generic/Flex'
import styles from '../../../styles/VersionPage.module.sass'
import { observer } from 'mobx-react'
import Report from './Report'
import { Report as ReportModel } from 'shared'

interface IProps {
	reports: ReportModel[]
	title: string
	icon: string
}

export default observer(function ClientRow({ reports, title, icon }: IProps) {
	return (
		<Flex col list m p className={styles.reportColumn}>
			<Flex pb spread>
				<Flex>
					<h3>{title}</h3>
					<SVG src={icon} />
				</Flex>
				<h4>{reports.length}</h4>
			</Flex>
			{reports.map((report) => <Report key={report.client.id} {...report} />)}
		</Flex>
	)
})
