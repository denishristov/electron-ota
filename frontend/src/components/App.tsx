import React from 'react'
import { RouteComponentProps, StaticContext } from 'react-router'
import { Transition, config } from 'react-spring'
import { getPathName } from '../util/functions'
import { pageAnimations } from '../util/constants/animations'
import AnimationContext from './contexts/AnimationContext'
import Routes from './Routes'

import styles from '../styles/util.module.sass'
import { observer } from 'mobx-react'
import Profile from './pages/AppsPage/Profile'

function App({ location, history }: RouteComponentProps<{}, StaticContext, {}>) {
	function goHome() {
		history.replace('/apps')
	}

	return (
		<>
			<div className={styles.background} />
			<Profile goHome={goHome} />
			<Transition
				native
				keys={getPathName}
				items={location}
				config={config.stiff}
				{...history.action === 'POP'
					? pageAnimations.POP
					: pageAnimations.PUSH
				}
			>
				{(location) => (animation) => (
					<AnimationContext.Provider value={animation}>
						<Routes location={location} />
					</AnimationContext.Provider>
				)}
			</Transition>
		</>
	)
}

export default observer(App)
