import React from 'react'
import Flex from '../Generic/Flex'
import Tip from '../Generic/Tip'

interface IProps {
	icon: string
	message: string
	count: number
}

export default function Counter({ icon, message, count }: IProps) {
	return (
		<Tip message={message}>
			<Flex centerY list>
				<SVG src={icon} />
				<h4>{count}</h4>
			</Flex>
		</Tip>
	)
}
