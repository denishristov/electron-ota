import React, { Component, ReactElement } from 'react'
import { list } from '../../util/functions'

import styles from '../../styles/util.module.sass'

interface IState {
	isPushed: boolean
}

interface IProps {
	children: ReactElement<any>
}

export default class Pushable extends Component<IProps, IState> {
	public state = {
		isPushed: false,
	}

	public componentWillUnmount() {
		removeEventListener('mouseup', this.handleMouseUp)
	}

	public render() {
		return React.cloneElement(this.props.children, {
			onMouseDown: this.handleMouseDown,
			onMouseUp: this.handleMouseUp,
			className: list(this.props.children.props.className, this.state.isPushed && styles.pushed),
		})
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
