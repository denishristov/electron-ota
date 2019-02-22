import React from 'react'
import { SystemType } from 'shared'
import { observer } from 'mobx-react'
import Flex from './Flex'
import { colors } from '../../util/constants/styles'

import styles from '../../styles/util.module.sass'
import { getColor } from '../../util/functions';

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

const labelsStyle = {
	fill: colors.ui.text,
	fontSize: 16,
}

const colorDomain = [0, 100]
const colorRange = [0, 10]

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
							colorDomain={colorDomain}
							colorRange={colorRange}
							getColor={getColor}
							labelsStyle={labelsStyle}
							data={data}
							width={300}
							height={300}
						>
							<GradientDefs>
								<linearGradient id={SystemType.Darwin} x1='0' x2='1' y1='0' y2='1'>
									<stop offset='0%' stopColor={colors.data.purple} stopOpacity={1} />
									<stop offset='100%' stopColor={colors.data.pink} stopOpacity={1} />
								</linearGradient>
								<linearGradient id={SystemType.Linux} x1='0' x2='1' y1='0' y2='1'>
									<stop offset='0%' stopColor={colors.data.yellow} stopOpacity={1} />
									<stop offset='100%' stopColor={colors.data.orange} stopOpacity={1} />
								</linearGradient>
								<linearGradient id={SystemType.Windows_RT} x1='0' x2='1' y1='0' y2='1'>
									<stop offset='0%' stopColor={colors.data.green} stopOpacity={1} />
									<stop offset='100%' stopColor={colors.data.blue} stopOpacity={1} />
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
									<Flex grow />
									<label>{d.angle}</label>
								</Flex>
							))}
							<Flex pt list y className={styles.total}>
								<Flex grow />
								<h4>Total</h4>
								<label>{data.reduce((sum, { angle }) => sum + angle, 0)}</label>
							</Flex>
						</Flex>
					</Flex>
				)
				: <p>No data</p>
			}
		</Flex>
	)
})
