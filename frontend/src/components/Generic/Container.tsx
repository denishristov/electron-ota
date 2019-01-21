import React from 'react'
import { list } from '../../util/functions'
import { Animated } from '../Context/AnimationContext'

export default function Container({ children, className, ...props }: any) {
	return (
		<Animated className={list('container-page', className)} {...props}>
			{children}
		</Animated>
	)
}
