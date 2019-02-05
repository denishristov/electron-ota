import React from 'react'

import styles from '../../styles/Layout.module.sass'
import { DivProps } from '../../util/types'
import { list as _list } from '../../util/functions'

interface IProps extends DivProps {
	column?: boolean
	centerY?: boolean
	centerX?: boolean
	spread?: boolean
	fill?: boolean
	margin?: boolean
	padding?: boolean
	list?: boolean
	left?: boolean
	right?: boolean
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

function Flex({
	className,
	centerX,
	centerY,
	spread,
	fill,
	margin,
	padding,
	column,
	list,
	left,
	right,
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
		column ? styles.column : styles.row,
		centerX && styles.centerX,
		centerY && styles.centerY,
		spread && styles.spread,
		fill && styles.fill,
		margin && styles.margin,
		padding && styles.padding,
		list && (column ? styles.listY : styles.listX),
		left && styles.left,
		right && styles.right,
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
}

export default Flex

/*
import React from 'react'

import styles from '../../styles/Layout.module.sass'
import { DivProps } from '../../util/types'
import { list as _list } from '../../util/functions'

interface IProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
	column?: boolean
	centerY?: boolean
	centerX?: boolean
	spread?: boolean
	fill?: boolean
	margin?: boolean
	padding?: boolean
	list?: boolean
	left?: boolean
	right?: boolean
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

export default class Flex extends React.PureComponent<IProps> {
	private static generateLayoutClassName({
		centerX,
		centerY,
		spread,
		fill,
		margin,
		padding,
		column,
		list,
		left,
		right,
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
	}: IProps) {
		return _list(
			column ? styles.column : styles.row,
			centerX && styles.centerX,
			centerY && styles.centerY,
			spread && styles.spread,
			fill && styles.fill,
			margin && styles.margin,
			padding && styles.padding,
			list && (column ? styles.listY : styles.listX),
			left && styles.left,
			right && styles.right,
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
		)
	}

	private readonly layoutClassName: string

	constructor(props: IProps) {
		super(props)
		console.log(props)

		this.layoutClassName = Flex.generateLayoutClassName(props)
	}

	public render() {
		const { className, ...props } = this.props

		return (
			<span className={_list(this.layoutClassName, className)} {...props} />
		)
	}
}
*/