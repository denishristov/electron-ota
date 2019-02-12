import React from 'react'

import styles from '../../styles/Input.module.sass'
import { observer } from 'mobx-react'
import { list } from '../../util/functions';

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string
	icon?: string
}

function Input({ label, icon, onClick, placeholder, ...props }: IProps) {
	return (
		<div className={list(styles.container, placeholder && styles.force)}>
			<input {...props} placeholder={placeholder || ' '} />
			<div className={styles.label}>{label}</div>
			<div className={styles.bar} />
			{icon && <SVG src={icon} className={styles.icon} />}
		</div>
	)
}

export default observer(Input)
