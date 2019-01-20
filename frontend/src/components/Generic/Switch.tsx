import React from 'react'
import ReactSwitch from 'react-switch'

// tslint:disable-next-line:max-line-length
const shadow = '0 5px 12px rgba(67, 106, 185, .12), 0 1px 4px rgba(67, 106, 185, .03), 0 -5px 15px -1px rgba(67, 106, 185, .01), inset 0 0 20px -3px rgba(67, 106, 185, .025)'

// tslint:disable-next-line:max-line-length
const activeShadow = '0 5px 12px rgba(67, 106, 185, .12), 0 1px 4px rgba(67, 106, 185, .03), 0 -5px 15px -1px rgba(67, 106, 185, .01), inset 0 0 20px -3px rgba(67, 106, 185, .025)'

interface IProps {
	onChange: (checked: boolean, event: MouseEvent | React.SyntheticEvent<MouseEvent | KeyboardEvent>, id: string) => void
	value: boolean
}

export default function Switch({ onChange, value }: IProps) {
	return (
		<ReactSwitch
			onChange={onChange}
			checked={value}
			onColor='#54f18e'
			offColor='#dedede'
			checkedIcon={false}
			uncheckedIcon={false}
			boxShadow={shadow}
			activeBoxShadow={activeShadow}
			handleDiameter={26}
			className='switch'
		/>
	)
}
