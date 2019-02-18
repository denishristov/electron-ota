import React from 'react'

import styles from '../../styles/Input.module.sass'
import { observer } from 'mobx-react'
import { list } from '../../util/functions'

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string
	icon?: string
}

function Input({ label, icon, onClick, placeholder, required, ...props }: IProps) {
	return (
		<div className={list(styles.container, placeholder && styles.force)}>
			<input {...props} placeholder={placeholder || ' '} required={required} />
			<div className={styles.label}>{label}</div>
			<div className={styles.bar} />
			{icon && <SVG src={icon} className={list(styles.icon, required && styles.iconRequired)} />}
			{required && <div className={styles.required} />}
		</div>
	)
}

export default observer(Input)
