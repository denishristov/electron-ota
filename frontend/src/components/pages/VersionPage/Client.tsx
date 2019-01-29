import React from 'react'
import { IClientModel } from 'shared'

import Windows from '../../../img/Windows.svg'
import Apple from '../../../img/Apple.svg'
import Ubuntu from '../../../img/Ubuntu.svg'

import styles from '../../../styles/VersionPage.module.sass'
import Flex from '../../generic/Flex'

const icons = {
	Darwin: Apple,
	Windows_RT: Windows,
	Linux: Ubuntu,
}

export default function Client({ username, systemType, osRelease }: IClientModel) {
	return (
		<Flex centerY padding className={styles.client}>
 			<h5>{username}</h5>
			<label>{osRelease}</label>
			<SVG src={icons[systemType]} />
		</Flex>
	)
}
