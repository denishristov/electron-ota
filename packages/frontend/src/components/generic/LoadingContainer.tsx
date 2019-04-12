import React from 'react'

import styles from '../../styles/Container.module.sass'
import { list } from '../../util/functions'
import Spinner from 'react-spinner-material'
import { colors } from '../../util/constants/styles'

export default function LoadingContainer() {
	return (
		<div className={list(styles.loadingContainer, styles.containerPage)}>
			<Spinner
				visible
				size={120}
				spinnerColor={colors.ui.darkAccent}
				spinnerWidth={4}
			/>
		</div>
	)
}
