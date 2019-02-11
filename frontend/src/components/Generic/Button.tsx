import React from 'react'
import Pushable from './Pushable'
import { list } from '../../util/functions'

import styles from '../../styles/Button.module.sass'

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	color?: 'green' | 'white' | 'blue' | 'orange' | 'red'
	size?: 'big' | 'small'
}

export default function Button({ className, color, size, ...props }: IProps) {
	return (
		<Pushable>
			<button
				className={list(
					className,
					color && styles[color],
					size && styles[size],
				)}
				{...props}
			/>
		</Pushable>
	)
}
