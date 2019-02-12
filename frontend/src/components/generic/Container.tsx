import React from 'react'
import { list } from '../../util/functions'
import { Animated, IAnimationProps } from '../contexts/AnimationContext'

import styles from '../../styles/Container.module.sass'

export default function Container({ className, ...props }: IAnimationProps) {
	return (
		<Animated className={list(styles.containerPage, className)} {...props} />
	)
}
