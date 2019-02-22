import React from 'react'
import Flex from './Flex'

const {
	XYPlot,
	XAxis,
	YAxis,
	VerticalGridLines,
	HorizontalGridLines,
	VerticalBarSeries,
	GradientDefs,
// tslint:disable-next-line:no-var-requires
} = require('react-vis')

import { colors } from '../../util/constants/styles'

import styles from '../../styles/util.module.sass'
import { observer } from 'mobx-react'

export interface IBarChartSystemTypeData {
	[systemType: string]: Array<{ x: string, y: number }>
}

interface IProps {
	data?: IBarChartSystemTypeData
	title: string
}

function round(num: number) {
	return num % 1 === 0 ? num : void 0
}

const labelsStyle = {
	text: {
		fill: colors.ui.accent,
		fontSize: 16,
	},
}

export default observer(function BarChart({ data, title }: IProps) {
	return (
			<Flex p m col list className={styles.darkTile}>
			<h3>{title}</h3>
			{data
				? (
					<Flex list x>
						<XYPlot
							animation
							width={300}
							height={300}
							stackBy='y'
							xType='ordinal'
							yPadding={10}
						>
							<VerticalGridLines />
							<HorizontalGridLines />
							<XAxis animation tickLabelAngle={-45} style={labelsStyle} />
							<YAxis animation tickFormat={round} style={labelsStyle} />
							{Object.entries(data).map(([systemType, data]) => (
								<VerticalBarSeries
									animation
									stroke='transparent'
									fill={`url(#${systemType})`}
									data={data}
								/>
							))}
						</XYPlot>
						<Flex col x list>
							{Object.entries(data).map(([systemType, data]) => (
								<Flex list y key={systemType}>
									<svg className={styles.legend}>
										<circle
											cx={8}
											cy={8}
											r={8}
											stroke={`url(#${systemType})`}
											fill={`url(#${systemType})`}
										/>
									</svg>
									<h4>{systemType}</h4>
									<Flex grow />
									<label>{data.reduce((sum, { y }) => sum + y, 0)}</label>
								</Flex>
							))}
							<Flex pt list y className={styles.total}>
								<Flex grow />
								<h4>Total</h4>
								<label>
									{[...Object.values(data)].flat().reduce((sum, { y }) => sum + y, 0)}
								</label>
							</Flex>
						</Flex>
					</Flex>
				)
				: <p>No data</p>
			}
			</Flex>
		)
})
