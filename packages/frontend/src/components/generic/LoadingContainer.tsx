import React from 'react'

import styles from '../../styles/Container.module.sass'
import { list } from '../../util/functions'

export default function LoadingContainer() {
	return (
		<div className={list(styles.loadingContainer, styles.containerPage)}>
			<h3>Loading</h3>
		</div>
	)
}
