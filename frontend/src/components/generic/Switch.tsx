import React from 'react'
import { colors } from '../../util/constants/styles'
const ReactSwitch = require('react-ios-switch')

interface IProps {
	onChange: (checked: boolean, event: MouseEvent | React.SyntheticEvent<MouseEvent | KeyboardEvent>, id: string) => void
	value: boolean
}

const style = {
	marginLeft: 'auto',
	// border: `1px solid ${colors.ui.accent}`,
}

export default function Switch({ onChange, value }: IProps) {
	return (
		<ReactSwitch
			style={style}
			onChange={onChange}
			checked={value}
			onColor={colors.data.green}
			offColor={colors.ui.entryBg}
		/>
	)
}
