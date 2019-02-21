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
		angle: number
		gradientLabel: string,
	}>
	title: string
}

function getColor(d: { gradientLabel: string }) {
	return `url(#${d.gradientLabel})`
}

const labelsStyle = {
	fill: colors.ui.text,
	fontSize: 16,
}

export default observer(function PieChart({ data, title }: IProps) {
	return (
		<Flex p m col list className={styles.darkTile}>
			<h3>{title}</h3>
			{data && Boolean(data.length)
				? (
					<Flex list x>
						<RadialChart
							animation
							showLabels
							labelsRadiusMultiplier={0.82}
							colorType='literal'
							colorDomain={[0, 100]}
							colorRange={[0, 10]}
							getColor={getColor}
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
							{data.map((d) => (
								<Flex list y key={d.label}>
									<svg className={styles.legend}>
										<circle cx={8} cy={8} r={8} stroke={getColor(d)} fill={getColor(d)} />
									</svg>
									<h4>{d.label}</h4>
									<label>{d.angle}</label>
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
