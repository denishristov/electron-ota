import React from 'react'
import { animated } from 'react-spring'
import { DivProps } from '../../util/types'
import { Omit } from 'typelevel-ts'
import LoadingContainer from '../generic/LoadingContainer'

export interface IAnimationProps extends Omit<DivProps, 'ref'> {
	showLoading?: boolean
}

interface IContext {
	animation: React.CSSProperties
	isResting: boolean
}

const AnimationContext = React.createContext<IContext>({ animation: {}, isResting: false })

export function Animated({ style, showLoading, ...props }: IAnimationProps) {
	return (
		<AnimationContext.Consumer>
			{({ animation, isResting }) => (
				<>
					<animated.div style={style ? { ...style, ...animation } : animation} {...props} />
					{showLoading && !isResting && <LoadingContainer />}
				</>
			)}
		</AnimationContext.Consumer>
	)
}

export default AnimationContext
