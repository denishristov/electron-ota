import React from 'react'
import Flex from './Flex'
import { DivProps } from '../../util/types'
import { Omit } from 'react-router';

interface IProps extends Omit<DivProps, 'ref'> {
	src: string
}

export default function SVG({ src, ...props }: IProps) {
	return (
		<Flex centerY centerX fill dangerouslySetInnerHTML={{ __html: src }} {...props} />
	)
}
