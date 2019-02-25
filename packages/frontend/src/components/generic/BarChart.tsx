import React, { useState } from 'react'
import Flex from './Flex'

const {
	XYPlot,
	XAxis,
	YAxis,
	VerticalGridLines,
	HorizontalGridLines,
	HorizontalBarSeries,
	GradientDefs,
	Hint,
// tslint:disable-next-line:no-var-requires
} = require('react-vis')

import { colors } from '../../util/constants/styles'

import styles from '../../styles/util.module.sass'
import { observer } from 'mobx-react'
import { SystemTypeDisplay } from 'shared'
import { list } from '../../util/functions'
import { computed } from 'mobx'
import AnimationContext from '../contexts/AnimationContext';

interface IDataPoint {
	x: number
	y: string
}

export interface IBarChartSystemTypeData {
	[systemType: string]: IDataPoint[]
}

interface IProps {
	data?: IBarChartSystemTypeData
	title: string
}

interface IState {
	dataPoint: IDataPoint | null
	isHovered: boolean
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

@observer
export default class BarChart extends React.Component<IProps, IState> {
	public state: IState = {
		dataPoint: null,
		isHovered: false,
	}

	@bind
	public handleOver(hovered: IDataPoint) {
		this.setState({ dataPoint: hovered, isHovered: true })
	}

	@bind
	public handleOut(hovered: IDataPoint) {
		this.setState({ dataPoint: hovered, isHovered: false })
	}

	@computed
	private get total() {
		const { data } = this.props
		return data && [...Object.values(data)].flat().reduce((sum, { x }) => sum + x, 0)
	}

	public render() {
		const { data, title } = this.props
		const { dataPoint, isHovered } = this.state

		return Boolean(this.total) && data ? (
			<AnimationContext.Consumer>
				{({ isResting }) => isResting && (
					<Flex p m col list className={styles.darkTile}>
						<h3>{title}</h3>
						<Flex list x>
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
								<YAxis animation style={labelsStyle} />
								{Object.entries(data).map(([systemType, data]) => (
									<HorizontalBarSeries
										animation={!isHovered}
										key={systemType}
										stroke='transparent'
										fill={`url(#${systemType})`}
										data={data}
										onValueMouseOver={this.handleOver}
										onValueMouseOut={this.handleOut}
									/>
								))}
								{dataPoint && (
									<Hint value={dataPoint}>
										<Flex col className={list(styles.hint, !isHovered && styles.reverse)}>
										<Flex list>
											<label className={styles.dark}>Version name</label>
											<label>{dataPoint.y}</label>
										</Flex>
										<Flex list>
											<label className={styles.dark}>Clients</label>
											<label>{dataPoint.x}</label>
										</Flex>
										</Flex>
									</Hint>
								)}
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
										<h4>{SystemTypeDisplay[systemType]}</h4>
										<Flex grow />
										<label>{data.reduce((sum, { x }) => sum + x, 0)}</label>
									</Flex>
								))}
								<Flex pt list y className={styles.total}>
									<Flex grow />
									<h4>Total</h4>
									<label>
										{this.total}
									</label>
								</Flex>
							</Flex>
						</Flex>
					</Flex>
			)}
			</AnimationContext.Consumer>
		)
		: null
	}
}
