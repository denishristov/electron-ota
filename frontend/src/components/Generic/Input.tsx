import React from 'react'

import styles from '../../styles/Input.module.sass'

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string
	icon?: string
}

function Input({ label, icon, ...props }: IProps) {
	return (
		<div>
			<label>{label}</label>
			<div className={styles.container}>
				<input {...props} />
				<div className={styles.bar} />
				{icon && <SVG src={icon} className={styles.icon} />}
			</div>
		</div>
	)
}

export default Input
