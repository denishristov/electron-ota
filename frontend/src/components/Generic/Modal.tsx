import React from 'react'
import { createPortal } from 'react-dom'
import { Spring, animated } from 'react-spring'

import styles from '../../styles/Modal.module.sass'

import Close from '../../img/Close.svg'

import { stopPropagation, getConfig, list } from '../../util/functions'
import { modalBackgroundAnimations, modalContentAnimations } from '../../util/constants/animations'

import Pushable from './Pushable'
import { ContentContext, TriggerContext, OpenTrigger, CloseTrigger } from '../contexts/ModalContext'
import { DivProps } from '../../util/types'

interface IProps extends DivProps {
	title?: string
	className?: string
	progress?: number
}

interface IState {
	isOpened: boolean
	isClosing: boolean
}

function Content({ children, title, className, progress }: IProps) {
	return createPortal(
		<TriggerContext.Consumer>
			{({ close, _close }) => (
				<ContentContext.Consumer>
					{({ isOpened, isClosing }) => isOpened && (
						<Spring
							native={true}
							reverse={isClosing}
							force={isClosing}
							onRest={_close}
							config={getConfig}
							{...modalBackgroundAnimations}
						>
							{(style) =>
								<animated.div
									className={styles.modalContainer}
									onClick={close}
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
													<Pushable>
														<SVG
															src={Close}
															className={styles.close}
															onClick={close}
														/>
													</Pushable>
												</header>
												{children}
											</animated.div>
										}
									</Spring>
								</animated.div>
							}
						</Spring>
					)}
				</ContentContext.Consumer>
			)}
		</TriggerContext.Consumer>
	, document.body)
}

export default class Modal extends React.Component<Pick<DivProps, 'children'>, IState> {
	public static readonly OpenTrigger = OpenTrigger

	public static readonly CloseTrigger = CloseTrigger

	public static readonly Content = Content

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
		const { open, close, _close } = this
		const { isOpened, isClosing } = this.state

		return (
			<TriggerContext.Provider value={{ open, close, _close }}>
				<ContentContext.Provider value={{ isOpened, isClosing }}>
					{this.props.children}
				</ContentContext.Provider>
			</TriggerContext.Provider>
		)

	}

	@bind
	private _close() {
		if (this.state.isClosing) {
			this.setState({ isOpened: false, isClosing: false })
		}
	}
}
