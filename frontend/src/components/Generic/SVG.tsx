import React from 'react'
import Flex from './Flex'
import { DivProps } from '../../util/types'

interface IProps extends DivProps {
	src: string
}

export default function SVG({ src, ...props }: IProps) {
	return (
		<Flex centerY centerX fill dangerouslySetInnerHTML={{ __html: src }} {...props} />
	)
}
