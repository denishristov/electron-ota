import React from 'react'
import { RouteComponentProps, StaticContext } from 'react-router'
import { Transition, config } from 'react-spring'
import { pageAnimations } from '../util/constants/animations'
import AnimationContext from './contexts/AnimationContext'
import Routes from './Routes'

import styles from '../styles/util.module.sass'
import { observer } from 'mobx-react'
import Profile from './pages/AppsPage/Profile'

const animationGetters = Object.keys(pageAnimations.POP).group((key) =>
	[key, ({ history }: RouteComponentProps) => {
		return (history.action === 'POP' ? pageAnimations.POP : pageAnimations.PUSH)[key]
	}],
)

function getKey({ location }: RouteComponentProps) {
	return location.pathname
}
interface IState {
	isResting: boolean
}

@observer
export default class App extends React.Component<RouteComponentProps, IState> {
	public state ={
		isResting: false,
	}

	public render() {
		const { isResting } = this.state
		
		return (
			<>
				<div className={styles.background} />
				<Profile goHome={this.goHome} />
				<Transition
					native
					keys={getKey}
					items={this.props}
					config={config.default}
					onRest={this.handleRest}
					onStart={this.handleStart}
					from={animationGetters.from}
					enter={animationGetters.enter}
					leave={animationGetters.leave}
				>
					{({ location }) => (animation) => (
						<AnimationContext.Provider value={{ animation, isResting }}>
							<Routes location={location} />
						</AnimationContext.Provider>
					)}
				</Transition>
			</>
		)
	}

	@bind
	private goHome() {
		this.props.history.replace('/apps')
	}

	@bind
	private handleRest() {
		!this.state.isResting && this.setState({ isResting: true })
	}

	@bind
	private handleStart() {
		this.state.isResting && this.setState({ isResting: false })
	}
}
