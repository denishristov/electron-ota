import React from 'react'

import styles from '../../styles/Input.module.sass'

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string
	icon?: string
}

function Input({ label, icon, onClick, ...props }: IProps) {
	return (
		<div className={styles.container}>
			<label>{label}</label>
			<input {...props} />
			<div className={styles.bar} />
			{icon && <SVG src={icon} className={styles.icon} />}
		</div>
	)
}

export default Input
