import React from 'react'
import { list } from '../../util/functions'

import styles from '../../styles/Button.module.sass'
import indexStyles from '../../index.module.sass'

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	color?: 'green' | 'white' | 'blue'
	size?: 'big' | 'small'
	noShadow?: boolean
}

interface IState {
	isPushed: boolean
}

export default class Button extends React.Component<IProps, IState> {
	public state = {
		isPushed: false,
	}

	public componentWillUnmount() {
		removeEventListener('mouseup', this.handleMouseUp)
	}

	public render() {
		const { className, color, size, noShadow, ...props } = this.props

		return (
			<button
				onMouseDown={this.handleMouseDown}
				onMouseUp={this.handleMouseUp}
				className={list(
					className,
					color && styles[color],
					size && styles[size],
					this.state.isPushed && indexStyles.shrink,
					Boolean(noShadow) && styles.noShadow,
				)}
				{...props}
			/>
		)
	}

	@bind
	private handleMouseDown() {
		this.setState({ isPushed: true })
		addEventListener('mouseup', this.handleMouseUp)
	}

	@bind
	private handleMouseUp() {
		removeEventListener('mouseup', this.handleMouseUp)
		this.setState({ isPushed: false })
	}
}
