import React from 'react'
import Flex from './Flex'
import Spinner from 'react-spinner-material'
import { colors } from '../../util/constants/styles'

interface IProps {
	color?: string
	height?: number
	width?: number
}

export default function LoadingPlaceholder({ color, height, width }: IProps) {
	return (
		<Flex x y grow style={{ height: height || '100%', width: width || '100%' }}>
			<Spinner
				visible
				size={80}
				spinnerColor={color || colors.data.blue}
				spinnerWidth={2}
			/>
		</Flex>
	)
}
