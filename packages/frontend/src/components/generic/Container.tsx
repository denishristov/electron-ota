import React from 'react'
import { list } from '../../util/functions'
import { Animated, IAnimationProps } from '../contexts/AnimationContext'

import styles from '../../styles/Container.module.sass'

interface IProps extends IAnimationProps {
	showLoading?: boolean
}

export default function Container({ className, ...props }: IProps) {
	return (
		<Animated
			className={list(styles.containerPage, className)}
			{...props}
		/>
	)
}
