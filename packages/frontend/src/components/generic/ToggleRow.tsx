import React from 'react'

import { observer } from 'mobx-react'

import Switch from './Switch'
import Flex from './Flex'

import styles from '../../styles/VersionModal.module.sass'
import utilStyles from '../../styles/util.module.sass'

interface IProps {
	label: string
	icon?: string
	value: boolean
	spread?: boolean
	onChange: () => void
}

export default observer(function ToggleRow({ icon, label, spread, ...props }: IProps) {
	return (
		<Flex y spread={spread} className={styles.osRow}>
			{icon && <SVG src={icon} />}
			<label className={utilStyles.dark}>{label}</label>
			<Switch {...props}	/>
		</Flex>
	)
})
