import React from 'react'
import { list } from '../../util/functions'
import { animated } from 'react-spring'

export default function Container({ children, className, ...props }: any) {
	return (
		<animated.div className={list('container-page', className)} {...props}>
			{children}
		</animated.div>
	)
}
