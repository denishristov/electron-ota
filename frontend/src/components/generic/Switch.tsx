import React from 'react'
import { colors } from '../../util/constants/styles'
const ReactSwitch = require('react-ios-switch')

import styles from '../../styles/Switch.module.sass'

interface IProps {
	onChange: (checked: boolean, event: MouseEvent | React.SyntheticEvent<MouseEvent | KeyboardEvent>, id: string) => void
	value: boolean
}

export default function Switch({ onChange, value }: IProps) {
	return (
		<ReactSwitch
			className={styles.switch}
			onChange={onChange}
			checked={value}
			onColor={colors.data.green}
			offColor={colors.ui.entryBg}
		/>
	)
}
