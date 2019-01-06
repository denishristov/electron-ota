import React from 'react'
import { list } from '../../util/functions'

import  '../../styles/Button.sass'

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	color: 'green' | 'grey'
}

interface IState {
	isPushed: boolean
}

export default class Button extends React.Component<IProps, IState> {
	state = {
		isPushed: false,
	}

	componentWillUnmount() {
		removeEventListener('mouseup', this.handleMouseUp)
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

	render() {
		const { className, color, ...props } = this.props

		return (
			<button
				onMouseDown={this.handleMouseDown}
				onMouseUp={this.handleMouseUp}
				className={list(className, color, this.state.isPushed && 'shrink')} 
				{...props} 
			/>
		)
	}
}

