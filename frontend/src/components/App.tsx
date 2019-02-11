import React from 'react'
import { RouteComponentProps, StaticContext } from 'react-router'
import { Transition } from 'react-spring'
import { getPathName } from '../util/functions'
import { pageAnimations } from '../util/constants/animations'
import AnimationContext from './contexts/AnimationContext'
import Routes from './Routes'

import styles from '../index.module.sass'
import { observer } from 'mobx-react'
import { animationConfig } from '../config'

function App({ location, history }: RouteComponentProps<{}, StaticContext, {}>) {
	return (
		<>
			<div className={styles.background} />
			<Transition
				native
				keys={getPathName}
				items={location}
				config={animationConfig}
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
