import React from 'react'
import Flex from './Flex'

const {
	XYPlot,
	XAxis,
	YAxis,
	VerticalGridLines,
	HorizontalGridLines,
	HorizontalBarSeries,
	GradientDefs,
// tslint:disable-next-line:no-var-requires
} = require('react-vis')

import { colors } from '../../util/constants/styles'

import styles from '../../styles/util.module.sass'
import { observer } from 'mobx-react'
import { SystemTypeDisplay } from 'shared'

export interface IBarChartSystemTypeData {
	[systemType: string]: Array<{ x: number, y: string }>
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
	const total = data && [...Object.values(data)].flat().reduce((sum, { x }) => sum + x, 0)

	return Boolean(total) && data ? (
		<Flex p m col list className={styles.darkTile}>
			<h3>{title}</h3>
			<Flex list x>
				{Boolean(total) && (
					<XYPlot
						animation
						width={300}
						height={480}
						stackBy='x'
						yType='ordinal'
					>
						<VerticalGridLines />
						<HorizontalGridLines />
						<XAxis animation tickLabelAngle={-45} tickFormat={round} style={labelsStyle} />
						<YAxis animation  style={labelsStyle} />
						{Object.entries(data).map(([systemType, data]) => (
							<HorizontalBarSeries
								animation
								key={systemType}
								stroke='transparent'
								fill={`url(#${systemType})`}
								data={data}
							/>
						))}
					</XYPlot>
				)}
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
							<h4>{SystemTypeDisplay[systemType]}</h4>
							<Flex grow />
							<label>{data.reduce((sum, { x }) => sum + x, 0)}</label>
						</Flex>
					))}
					<Flex pt list y className={styles.total}>
						<Flex grow />
						<h4>Total</h4>
						<label>
							{total}
						</label>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	)
	: null
})
