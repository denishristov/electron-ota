import React from 'react'
import ReactSwitch from 'react-switch'
import styles from '../../index.module.sass'
import { green, accent, shadow, activeShadow } from '../../util/constants/styles'

interface IProps {
	onChange: (checked: boolean, event: MouseEvent | React.SyntheticEvent<MouseEvent | KeyboardEvent>, id: string) => void
	value: boolean
}

export default function Switch({ onChange, value }: IProps) {
	return (
		<ReactSwitch
			onChange={onChange}
			checked={value}
			onColor={green}
			offColor={accent}
			checkedIcon={false}
			uncheckedIcon={false}
			boxShadow={shadow}
			activeBoxShadow={activeShadow}
			handleDiameter={26}
			className={styles.switch}
		/>
	)
}
