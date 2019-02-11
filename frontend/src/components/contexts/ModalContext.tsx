import React, { ReactElement } from 'react'
import { noop } from '../../util/functions'

interface IModalContext {
	open: () => void
	close: () => void
	_close: () => void
}

interface IContentContext {
	isOpened: boolean
	isClosing: boolean
}

interface IProps {
	children: ReactElement<{}>
}

export const TriggerContext = React.createContext<IModalContext>({ open: noop, close: noop, _close: noop })

function Trigger(kind: 'open' | 'close') {
	return (props: IProps) => {
		const actionType = props.children.type === 'form' ? 'onSubmit' : 'onClick'
		return (
			<TriggerContext.Consumer>
				{(context) => React.cloneElement(props.children, {
					[actionType]: async (event: Event) => {
						props.children.props[actionType] && await props.children.props[actionType](event)
						context[kind] && context[kind]()
					},
				})}
			</TriggerContext.Consumer>
		)
	}
}

export const OpenTrigger = Trigger('open')
export const CloseTrigger = Trigger('close')

export const ContentContext = React.createContext<IContentContext>({ isOpened: false, isClosing: false })
