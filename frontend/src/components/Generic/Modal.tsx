import React from 'react'
import { Spring, animated, config } from 'react-spring'

import styles from '../../styles/Modal.module.sass'
import indexStyles from '../../index.module.sass'

import Close from '../../img/Close.svg'

import { stopPropagation, getConfig, list, stopEvent } from '../../util/functions'
import { modalBackgroundAnimations, modalContentAnimations } from '../../util/constants/animations'

interface IProps {
	title?: string
	className?: string
	progress?: number
}

interface IState {
	isOpened: boolean
	isClosing: boolean
}

export default class Modal extends React.Component<IProps, IState> {
	public readonly state = {
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
	public open() {
		this.setState({ isOpened: true })
	}

	public render() {
		const { children, title, className, progress } = this.props
		const { isOpened, isClosing } = this.state

		return isOpened && (
			<Spring
				native={true}
				reverse={isClosing}
				force={isClosing}
				onRest={this._close}
				config={getConfig}
				{...modalBackgroundAnimations}
			>
				{(style) =>
					<animated.div
						className={styles.modalContainer}
						onClick={this.close}
						style={style}
						onScroll={stopPropagation}
					>
						{Boolean(progress) && (
							<div className={styles.progressBar}>
								<div
									className={styles.completed}
									style={{ width: `${progress}%` }}
								/>
							</div>
						)}
						<Spring
							native={true}
							reverse={isClosing}
							force={isClosing}
							config={getConfig}
							{...modalContentAnimations}
						>
							{(style) =>
								<animated.div
									className={list(styles.content, className)}
									style={style}
									onClick={stopPropagation}
								>
									<header className={styles.spread}>
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
	}

	@bind
	private _close() {
		if (this.state.isClosing) {
			this.setState({ isOpened: false, isClosing: false })
		}
	}
}
