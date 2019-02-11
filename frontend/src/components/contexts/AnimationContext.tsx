import React from 'react'
import { animated } from 'react-spring'
import { DivProps } from '../../util/types'
import { Omit } from 'typelevel-ts'

export interface IAnimationProps extends Omit<DivProps, 'ref'> {}

const AnimationContext = React.createContext<React.CSSProperties>({})

export function Animated({ style, ...props }: IAnimationProps) {
	return (
		<AnimationContext.Consumer>
			{(animation) => (
				<animated.div style={{ ...style, ...animation }} {...props} />
			)}
		</AnimationContext.Consumer>
	)
}

export default AnimationContext
