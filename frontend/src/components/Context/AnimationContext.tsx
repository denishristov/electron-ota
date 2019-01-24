import React from 'react'
import { animated } from 'react-spring'
import { DivProps } from '../../util/types'
import { Omit } from 'typelevel-ts'

export interface IAnimationProps extends Omit<DivProps, 'ref'> {}

const { Provider, Consumer } = React.createContext<React.CSSProperties>({})

export function Animated({ style, ...props }: IAnimationProps) {
	return (
		<Consumer>
			{(animation) => (
				<animated.div style={{ ...style, ...animation }} {...props} />
			)}
		</Consumer>
	)
}

export { Provider as AnimationProvider }
