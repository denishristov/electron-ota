import React from 'react'
import { animated } from 'react-spring'

interface IProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	ref: undefined
}

const { Provider, Consumer } = React.createContext<React.CSSProperties>({})

export function Animated({ style, ...props }: IProps) {
	return (
		<Consumer>
			{(animation) => (
				<animated.div style={{ ...style, ...animation }} {...props} />
			)}
		</Consumer>
	)
}

export { Provider as AnimationProvider }
