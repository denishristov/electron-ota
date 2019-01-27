import React from 'react'

import Flex from '../../generic/Flex'
import Tip from '../../generic/Tip'

import { DivProps } from '../../../util/types'

interface IProps extends DivProps {
	icon: string
	message: string
	count: number
}

export default function Counter({ icon, count, className, message }: IProps) {
	return (
		<Tip className={className} message={message}>
			<Flex centerY>
				<SVG src={icon} />
				<h5>{count}</h5>
			</Flex>
		</Tip>
	)
}
