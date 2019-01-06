import React from 'react'
import { list } from '../../util/functions'

function Row({ className, ...props }: React.InputHTMLAttributes<HTMLDivElement>) {
	return (
		<div className={list(className, 'row')} {...props} />
	)
}

export default Row
