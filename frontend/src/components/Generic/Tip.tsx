import React from 'react'
import { DivProps } from '../../util/types'

import styles from '../../styles/Tip.module.sass'
import { list } from '../../util/functions'

interface IProps extends DivProps {
	message: string
}

interface IState  {
	isHovered: boolean
}

export default class Tip extends React.Component<IProps, IState> {
	public readonly state = {
		isHovered: false,
	}

	private readonly containerRef = React.createRef<HTMLSpanElement>()

	private position?: React.CSSProperties

	public render() {
		const { children, message, className, ...props } = this.props

		return (
			<span
				className={list(className, styles.container)}
				onMouseOver={this.handleMouseOver}
				onMouseLeave={this.handleMouseLeave}
				ref={this.containerRef}
				{...props}
			>
				{children}
				<span className={styles.tip} style={this.position}>{message}</span>
			</span>
		)
	}

	@bind
	private handleMouseOver() {
		this.setState({ isHovered: true })

		const { current } = this.containerRef

		if (current && !this.position) {
			const tip = current.childNodes[1]

			this.position = this.calculateLeftOffset(
				current.getBoundingClientRect(),
				(tip as HTMLSpanElement).getBoundingClientRect(),
			)
		}
	}

	@bind
	private handleMouseLeave() {
		this.setState({ isHovered: false })
	}

	private calculateLeftOffset(container: ClientRect | DOMRect, tip: ClientRect | DOMRect) {
		return { left: Math.round((container.width - tip.width) / 2) }
	}
}
