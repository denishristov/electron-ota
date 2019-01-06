import React from 'react'
import { Spring, animated, config } from 'react-spring'

import '../../styles/Modal.sass'

import Close from '../../img/Close.svg'
import stopPropagation from '../../util/functions'

interface IProps {
	title: string
}

interface IState {
	isOpened: boolean
	isClosing: boolean
}

const contentFrom = {
	transform: 'scale(0.96) translateY(-30%)',
	opacity: 0,
}

const contentTo = {
	transform: 'scale(1) translateY(0)',
	opacity: 1
}

const backgroundFrom = {
	opacity: 0,
}

const backgroundTo = {
	opacity: 1,
}

export default class Modal extends React.Component<IProps, IState> {
	private timeout?: NodeJS.Timeout

	readonly state = {
		isOpened: false,
		isClosing: false,
	}

	@bind
	public close(event?: React.MouseEvent) {
		if (event) {
			event.stopPropagation()
		}

		this.setState({ isClosing: true })
	}

	@bind
	private _close() {
		if (this.state.isClosing) {
			this.setState({ isOpened: false, isClosing: false })
		}
	}

	@bind
	public open() {
		this.setState({ isOpened: true })
	}

	public render() {
		const { children, title } = this.props
		const { isOpened, isClosing } = this.state

		return isOpened 
			? (
				<Spring
					from={backgroundFrom}
					to={backgroundTo}
					native 
					reverse={isClosing} 
					force={isClosing}
				>
					{style =>
						<animated.div 
							className='modal-container' 
							onClick={this.close}
							style={style}
						>
							<Spring 
								from={contentFrom}
								to={contentTo}
								native 
								reverse={isClosing} 
								force={isClosing}
								config={config.wobbly}
								onRest={this._close}
							>
								{style =>
									<animated.div 
										className='content' 
										style={style} 
										onClick={stopPropagation}
									>
										<header className='spread'>
											<h2>{title}</h2>
											<SVG 
												src={Close} 
												onClick={this.close} 
											/>
										</header>
										{children}
									</animated.div>
								}
							</Spring>
						</animated.div>
					}
				</Spring>
			)
			: null
	}
}