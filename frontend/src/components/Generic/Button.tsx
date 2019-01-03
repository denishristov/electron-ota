import React from 'react'
import { list } from '../../util/functions'

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	color: 'green'
}

interface IState {
	isPushed: boolean
}

const shrinkClass = 'shrink'

export default class Button extends React.Component<IProps, IState> {
	state = {
		isPushed: false,
	}

	@bind
	private handleMouseDown() {
		this.setState({ isPushed: true })
	}

	@bind
	private handleMouseUp() {
		this.setState({ isPushed: false })
	}

	render() {
		const { className, color, ...props } = this.props

		return (
			<button 
				onMouseDown={this.handleMouseDown}
				onMouseUp={this.handleMouseUp}
				className={list(className, color, this.state.isPushed && shrinkClass)} 
				{...props} 
			/>
		)
	}
}

