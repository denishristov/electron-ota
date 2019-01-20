import React from 'react'
import { list } from '../../util/functions';

export default function Column({ className, ...props }: React.InputHTMLAttributes<HTMLDivElement>) {
	return (
		<div className={list(className, 'column')} {...props} />
	)
}
