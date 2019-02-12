import React from 'react'

import styles from '../../styles/Layout.module.sass'
import { DivProps } from '../../util/types'
import { list as _list } from '../../util/functions'

interface IProps extends DivProps {
	col?: boolean
	y?: boolean
	x?: boolean
	spread?: boolean
	fill?: boolean
	m?: boolean
	p?: boolean
	list?: boolean
	grow?: boolean
	mta?: boolean
	mt?: boolean
	mba?: boolean
	mb?: boolean
	mla?: boolean
	ml?: boolean
	mra?: boolean
	mr?: boolean
	pta?: boolean
	pt?: boolean
	pba?: boolean
	pb?: boolean
	pla?: boolean
	pl?: boolean
	pra?: boolean
	pr?: boolean
}

export default React.memo(function Flex({
	className,
	x,
	y,
	spread,
	fill,
	m,
	p,
	col,
	list,
	grow,
	mta,
	mt,
	mba,
	mb,
	mla,
	ml,
	mra,
	mr,
	pta,
	pt,
	pba,
	pb,
	pla,
	pl,
	pra,
	pr,
	...props
}: IProps) {
	const flexClassName = _list(
		col ? styles.column : styles.row,
		x && styles.centerX,
		y && styles.centerY,
		spread && styles.spread,
		fill && styles.fill,
		m && styles.margin,
		p && styles.padding,
		list && (col ? styles.listY : styles.listX),
		grow && styles.grow,
		mta && styles.mta,
		mt && styles.mt,
		mba && styles.mba,
		mb && styles.mb,
		mla && styles.mla,
		ml && styles.ml,
		mra && styles.mra,
		mr && styles.mr,
		pta && styles.pta,
		pt && styles.pt,
		pba && styles.pba,
		pb && styles.pb,
		pla && styles.pla,
		pl && styles.pl,
		pra && styles.pra,
		pr && styles.pr,
		className,
	)

	return (
		<span className={flexClassName} {...props} />
	)
})
