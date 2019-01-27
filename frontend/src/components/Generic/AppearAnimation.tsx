import React from 'react'
import { Transition } from 'react-spring'
import { versionsTransitions } from '../../util/constants/animations'
import { getConfig, getId } from '../../util/functions'
import { IEntry } from '../../util/types'

interface IProps<T> {
	children: (item: T) => (style: React.CSSProperties) => JSX.Element
	items: T[]
}

export default function AppearAnimation<T extends IEntry>({ children, items }: IProps<T>) {
	return children && (
		<Transition
			native
			items={items}
			keys={getId}
			config={getConfig}
			trail={64}
			{...versionsTransitions}
		>
			{(item) => (animation) => children(item)(animation)}
		</Transition>
	)
}
