import React from 'react'
import { SystemType } from 'shared'
import { observer } from 'mobx-react'
import Flex from './Flex'
import { colors } from '../../util/constants/styles'

import styles from '../../styles/util.module.sass'

// tslint:disable-next-line:no-var-requires
const { RadialChart, GradientDefs } = require('react-vis')

interface IProps {
	data?: Array<{
		label: string
		angle: number,
	}>
	title: string
}

function getColor(d: { gradientLabel: string }) {
	return `url(#${d.gradientLabel})`
}

const labelsStyle = {
	fill: colors.ui.accent,
	fontSize: 16,
}

const margins = {
	left: 160,
	right: 160,
	top: 160,
	bottom: 160,
}

export default observer(function PieChart({ data, title }: IProps) {
	return (
		<Flex p col list className={styles.darkTile}>
			<h3>{title}</h3>
			{data && Boolean(data.length)
				? (
					<Flex list x>
						<RadialChart
							animation
							showLabels
							colorType='literal'
							colorDomain={[0, 100]}
							colorRange={[0, 10]}
							getColor={getColor}
							margin={margins}
							labelsStyle={labelsStyle}
							data={data}
							width={300}
							height={300}
						>
							<GradientDefs>
								<linearGradient id={SystemType.Darwin} x1='0' x2='0' y1='0' y2='1'>
									<stop offset='0%' stopColor={colors.data.red} stopOpacity={0.7} />
									<stop offset='100%' stopColor={colors.data.purple} stopOpacity={0.7} />
								</linearGradient>
								<linearGradient id={SystemType.Linux} x1='0' x2='0' y1='0' y2='1'>
									<stop offset='0%' stopColor={colors.data.yellow} stopOpacity={0.7} />
									<stop offset='100%' stopColor={colors.data.orange} stopOpacity={0.7} />
								</linearGradient>
								<linearGradient id={SystemType.Windows_RT} x1='0' x2='0' y1='0' y2='1'>
									<stop offset='0%' stopColor={colors.data.blue} stopOpacity={0.7} />
									<stop offset='100%' stopColor={colors.data.green} stopOpacity={0.7} />
								</linearGradient>
							</GradientDefs>
						</RadialChart>
						<Flex col x list>
							{data.map(({ label, angle }) => (
								<Flex list y key={label}>
									<h4>{label}</h4>
									<label>{angle}</label>
								</Flex>
							))}
						</Flex>
					</Flex>
				)
				: <p>No data</p>
			}
		</Flex>
	)
})
