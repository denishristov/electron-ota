import React from 'react'
import { createPortal } from 'react-dom'
import { Spring, animated, config } from 'react-spring'

import styles from '../../styles/Modal.module.sass'

import Close from '../../img/Close.svg'

import { stopPropagation, list, stopEvent } from '../../util/functions'
import { modalBackgroundAnimations, modalContentAnimations } from '../../util/constants/animations'

import Pushable from './Pushable'
import { ContentContext, TriggerContext, OpenTrigger, CloseTrigger } from '../contexts/ModalContext'
import { DivProps } from '../../util/types'
import { animationConfig } from '../../config'

interface IContentProps<T = {}> extends Exclude<DivProps, 'children'> {
	title?: string
	className?: string
	component: JSX.Element
}

interface IModalProps extends Pick<DivProps, 'children'> {
	disableClose?: boolean
}

interface IState {
	isOpened: boolean
	isClosing: boolean
}

function Content<T>({ component, title, className }: IContentProps<T>) {
	return createPortal(
		<TriggerContext.Consumer>
			{({ close, _close }) => (
				<ContentContext.Consumer>
					{({ isOpened, isClosing }) => isOpened && (
						<Spring
							native
							reverse={isClosing}
							force={isClosing}
							config={config.stiff}
							{...modalBackgroundAnimations}
						>
							{(style) =>
								<animated.div
									className={styles.modalContainer}
									onClick={close}
									style={style}
								>
									<Spring
										native
										onRest={_close}
										reverse={isClosing}
										force={isClosing}
										config={animationConfig}
										{...modalContentAnimations}
									>
										{(style) =>
											<animated.div
												className={list(styles.content, className)}
												style={style}
												onClick={stopPropagation}
											>
												{title && (
													<header className={styles.spread}>
														<h2>{title}</h2>
														{/* <Pushable>
															<SVG
																src={Close}
																className={styles.close}
																onClick={close}
															/>
														</Pushable> */}
													</header>
												)}
												{component}
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

export default class Modal extends React.Component<IModalProps, IState> {
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

		if (!this.props.disableClose) {
			this.setState({ isClosing: true })
		}

		requestAnimationFrame(() => {
			document.body.style.overflow = 'unset'
		})
	}

	@bind
	public open() {
		this.setState({ isOpened: true })

		requestAnimationFrame(() => {
			document.body.style.overflow = 'hidden'
		})
	}

	public render() {
		const { open, close, _close } = this

		return (
			<TriggerContext.Provider value={{ open, close, _close }}>
				<ContentContext.Provider value={this.state}>
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
