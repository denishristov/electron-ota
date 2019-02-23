import React from 'react'
import { observer } from 'mobx-react'
import Flex from './Flex'
import styles from '../../styles/util.module.sass'
import { colors } from '../../util/constants/styles'
import { list, formatDate as formatDateFull } from '../../util/functions'

const {
	XYPlot,
	XAxis,
	YAxis,
	VerticalGridLines,
	HorizontalGridLines,
	AreaSeries,
	Crosshair,
	GradientDefs,
// tslint:disable-next-line:no-var-requires
} = require('react-vis')

interface IDataPoint {
	x: Date
	y: number
}

interface IProps {
	data: IDataPoint[]
	title: string
	color: string
}

interface IState {
	crosshairValues: IDataPoint[]
	isHovered: boolean
}

function formatDate(date: Date) {
	const options = {
		day: '2-digit',
		hour: '2-digit',
	}

	return date.toLocaleDateString('en-US', options)
}

const labelsStyle = {
	text: {
		fill: colors.ui.accent,
		fontSize: 10,
	},
}

const lineStyles = {
	line: {
		stroke: colors.data.blue,
		strokeWidth: 4,
	},
}

@observer
export default class AreaChart extends React.Component<IProps, IState> {
	public state: IState = {
		crosshairValues: [],
		isHovered: false,
	}

	private readonly colorKey = `key-${this.props.color.substring(1)}`

	@bind
	public handleMouseLeave() {
		this.setState({ isHovered: false })
	}

	@bind
	public handleNearestX(_: null, { index }: { index: number}) {
		this.setState({ crosshairValues: [this.props.data[index]], isHovered: true  })
	}

	public render() {
		const { data, title, color } = this.props
		const { isHovered } = this.state
		const [hovered] = this.state.crosshairValues

		return data && data.length ? (
			<Flex p m col list className={styles.darkTile}>
				<h3>{title}</h3>
				<Flex list x>
					<XYPlot
						onMouseLeave={this.handleMouseLeave}
						width={600}
						height={300}
						xType='time'
					>
						<GradientDefs>
							<linearGradient id={this.colorKey} x1='0' x2='0' y1='0' y2='1'>
								<stop offset='0%' stopColor={color} stopOpacity={1} />
								<stop offset='100%' stopColor={color} stopOpacity={0.1} />
							</linearGradient>
						</GradientDefs>
						<VerticalGridLines />
						<HorizontalGridLines />
						<XAxis
							animation
							tickLabelAngle={-45}
							tickFormat={formatDate}
							style={labelsStyle}
						/>
						<YAxis animation style={labelsStyle} />
						<AreaSeries
							animation
							onNearestX={this.handleNearestX}
							data={data}
							curve='curveMonotoneX'
							stroke='transparent'
							color={`url(#${this.colorKey})`}
						/>
						{isHovered && (
							<Crosshair
								values={this.state.crosshairValues}
								styles={lineStyles}
							>
								<Flex col className={list(styles.hint, !isHovered && styles.reverse)}>
									<Flex list>
										<label className={styles.dark}>Date</label>
										<label>{formatDateFull(hovered.x)}</label>
									</Flex>
									<Flex list>
										<label className={styles.dark}>Clients</label>
										<label>{hovered.y}</label>
									</Flex>
								</Flex>
							</Crosshair>
						)}
					</XYPlot>
				</Flex>
			</Flex>
		)
		: null
	}
}
