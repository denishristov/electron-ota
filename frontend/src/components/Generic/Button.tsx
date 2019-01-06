import React from 'react'
import { list } from '../../util/functions'

import '../../styles/Button.sass'

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	color: 'green' | 'grey'
	size?: 'big' | 'small'
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
		const { className, color, size, ...props } = this.props

		return (
			<button
				onMouseDown={this.handleMouseDown}
				onMouseUp={this.handleMouseUp}
				className={list(className, color, size, this.state.isPushed && 'shrink')}
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
