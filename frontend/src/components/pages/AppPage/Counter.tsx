import React from 'react'

import Flex from '../../generic/Flex'
import Tip from '../../generic/Tip'

import { DivProps } from '../../../util/types'
import { observer } from 'mobx-react'

import styles from '../../../styles/Version.module.sass'

interface IProps extends DivProps {
	icon: string
	message: string
	count: number
	color: string
}

export default observer(function Counter({ icon, count, message, color }: IProps) {
	return count ? (
		<Tip message={message}>
			<Flex y className={styles.counter}>
				<SVG src={icon} style={{ backgroundColor: color }} />
				<h5>{count}</h5>
			</Flex>
		</Tip>
	) : null
})
