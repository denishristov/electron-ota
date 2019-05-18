import React from 'react'
import { DivProps } from '../../util/types'

import styles from '../../styles/Tip.module.sass'
import { list } from '../../util/functions'
import { createPortal } from 'react-dom'

interface IProps extends DivProps {
	message: string
}

interface IState {
	isHovered: boolean
}

export default class Tip extends React.Component<IProps, IState> {
	public readonly state = {
		isHovered: false,
	}

	private readonly containerRef = React.createRef<HTMLSpanElement>()

	private readonly tipRef = React.createRef<HTMLSpanElement>()

	private position?: React.CSSProperties

	public render() {
		const { isHovered } = this.state
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
				{createPortal(
					<span
						ref={this.tipRef}
						className={list(styles.tip, isHovered && styles.hovered)}
						style={this.position}
					>
						{message}
					</span>,
					document.body,
				)}
			</span>
		)
	}

	@bind
	private handleMouseOver() {
		this.setState({ isHovered: true })

		const { current: container } = this.containerRef
		const { current: tip } = this.tipRef

		if (container && tip && !this.position) {
			this.position = this.calculateLeftOffset(
				container.getBoundingClientRect(),
				tip.getBoundingClientRect(),
			)
		}
	}

	@bind
	private handleMouseLeave() {
		this.setState({ isHovered: false })
	}

	private calculateLeftOffset(container: ClientRect | DOMRect, tip: ClientRect | DOMRect) {
		return {
			top: container.top - tip.height - 16,
			left: container.left + Math.round((container.width - tip.width) / 2),
		}
	}
}
