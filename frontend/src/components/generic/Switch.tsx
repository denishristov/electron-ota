import React from 'react'
import ReactSwitch from 'react-switch'
import { colors, shadows } from '../../util/constants/styles'

interface IProps {
	onChange: (checked: boolean, event: MouseEvent | React.SyntheticEvent<MouseEvent | KeyboardEvent>, id: string) => void
	value: boolean
}

export default function Switch({ onChange, value }: IProps) {
	return (
		<ReactSwitch
			onChange={onChange}
			checked={value}
			onColor={colors.green}
			offColor={colors.accent}
			checkedIcon={false}
			uncheckedIcon={false}
			boxShadow={shadows.rest}
			activeBoxShadow={shadows.active}
			handleDiameter={26}
		/>
	)
}
