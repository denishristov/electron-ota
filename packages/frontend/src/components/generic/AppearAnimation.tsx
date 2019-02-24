import React from 'react'
import { Transition } from 'react-spring'
import { versionsTransitions } from '../../util/constants/animations'
import { getId } from '../../util/functions'
import { IEntry } from '../../util/types'
import { animationConfig } from '../../config'

interface IProps<T extends IEntry> {
	children: (item: T) => (style: React.CSSProperties) => JSX.Element
	items: T[]
}

const trail = 2 ** 5

export default function AppearAnimation<T extends IEntry>({ children, items }: IProps<T>) {
	return children && (
		<Transition
			native
			unique
			config={animationConfig}
			keys={getId}
			items={items}
			trail={trail}
			{...versionsTransitions}
		>
			{(item) => (animation) => children(item)(animation)}
		</Transition>
	)
}
