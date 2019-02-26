import React from 'react'

import { observer } from 'mobx-react'

import Switch from './Switch'
import Flex from './Flex'

import styles from '../../styles/VersionModal.module.sass'
import utilStyles from '../../styles/util.module.sass'
import Tip from './Tip'

interface IProps {
	label: string
	icon?: string
	value: boolean
	spread?: boolean
	color?: string
	message?: string
	onChange: () => void
}

export default observer(function ToggleRow({ icon, label, spread, message, color, ...props }: IProps) {
	return (
		<Flex y spread={spread} className={styles.osRow}>
			{icon && <SVG src={icon} />}
			{color && <div className={styles[color]} />}
			<label className={utilStyles.dark}>{label}</label>
			{message && (
				<Tip message={message}>
					<Flex x y className={styles.help}>?</Flex>
				</Tip>
			)}
			<Switch {...props}	/>
		</Flex>
	)
})
