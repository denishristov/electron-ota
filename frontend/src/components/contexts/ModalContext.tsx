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
	children: ReactElement<any>
}

export const TriggerContext = React.createContext<IModalContext>({ open: noop, close: noop, _close: noop })

export function Trigger(kind: 'open' | 'close') {
	return (props: IProps) => {
		const actionType = props.children.type === 'form' ? 'onSubmit' : 'onClick'

		return (
			<TriggerContext.Consumer>
				{(context) => React.cloneElement(props.children, {
					[actionType]: async (event: PointerEvent) => {
						props[actionType] && await props[actionType](event)
						context[kind] && context[kind]()
					},
				})}
			</TriggerContext.Consumer>
		)
	}
}

export const ContentContext = React.createContext<IContentContext>({ isOpened: false, isClosing: false })
