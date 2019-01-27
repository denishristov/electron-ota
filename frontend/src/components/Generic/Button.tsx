import React from 'react'
import Pushable from './Pushable'
import { list } from '../../util/functions'

import styles from '../../styles/Button.module.sass'

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	color?: 'green' | 'white' | 'blue'
	size?: 'big' | 'small'
	noShadow?: boolean
}

export default function Button({ className, color, size, noShadow, ...props }: IProps) {
	return (
		<Pushable>
			<button
				className={list(
					className,
					color && styles[color],
					size && styles[size],
					Boolean(noShadow) && styles.noShadow,
				)}
				{...props}
			/>
		</Pushable>
	)
}
