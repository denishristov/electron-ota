import React from 'react'

import  '../../styles/Input.sass'

import User from '../../img/User.svg'

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string
	icon?: string
}

function Input({ label, icon, ...props }: IProps) {
	return (
		<>
			<label>{label}</label>
			<div className='input-container'>
				<input {...props} />
				<div className='input-bar' />
				{icon && <SVG src={icon} className='icon' />}
			</div>
		</>
	)
}

export default Input
