import React from 'react'

import styles from '../../styles/Layout.module.sass'
import { DivProps } from '../../util/types'
import { list as _list } from '../../util/functions'

interface IProps extends DivProps {
	column?: boolean
	centerY?: boolean
	centerX?: boolean
	spread?: boolean
	expand?: boolean
	margin?: boolean
	padding?: boolean
	list?: boolean
	left?: boolean
	right?: boolean
	grow?: boolean
}

function Flex({
	className,
	centerX,
	centerY,
	spread,
	expand,
	margin,
	padding,
	column,
	list,
	left,
	right,
	grow,
	...props
}: IProps) {
	const flexClassName = _list(
		column ? styles.column : styles.row,
		centerX && styles.centerX,
		centerY && styles.centerY,
		spread && styles.spread,
		expand && styles.expand,
		margin && styles.margin,
		list && (column ? styles.listY : styles.listX),
		left && styles.left,
		right && styles.right,
		grow && styles.grow,
		className,
	)

	return (
		<span className={flexClassName} {...props} />
	)
}

export default Flex
