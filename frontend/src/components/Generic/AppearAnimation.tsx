import React from 'react'
import { Transition } from 'react-spring'
import { versionsTransitions } from '../../util/constants/animations'
import { getId } from '../../util/functions'
import { IEntry } from '../../util/types'
import { animationConfig } from '../../config/config'

interface IProps<T extends IEntry> {
	children: (item: T) => (style: React.CSSProperties) => JSX.Element
	items: T[]
}

export default function AppearAnimation<T extends IEntry>({ children, items }: IProps<T>) {
	return children && (
		<Transition
			native
			unique
			config={animationConfig}
			// keys={getId}
			items={items}
			trail={64}
			{...versionsTransitions}
		>
			{(item) => (animation) => children(item)(animation)}
		</Transition>
	)
}
