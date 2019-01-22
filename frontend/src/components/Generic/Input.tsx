import React from 'react'

import styles from '../../styles/Input.module.sass'
const { inputContainer, inputBar } = styles
console.log(styles)

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string
	icon?: string
}

function Input({ label, icon, ...props }: IProps) {
	return (
		<>
			<label>{label}</label>
			<div className={styles['input-container']}>
				<input {...props} />
				<div className={styles['input-bar']} />
				{icon && <SVG src={icon} className='icon' />}
			</div>
		</>
	)
}

export default Input
