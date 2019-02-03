import React from 'react'
import { ClientModel } from 'shared'

import styles from '../../../styles/VersionPage.module.sass'
import Flex from '../../generic/Flex'
import icons from '../../../util/constants/icons'
import { observer } from 'mobx-react'

interface IProps {
	client: ClientModel
}

export default observer(function Client({ client }: IProps) {
	return (
		<Flex centerY padding className={styles.client}>
 			<h5>{client.username}</h5>
			<label>{client.osRelease}</label>
			<SVG src={icons[client.systemType]} />
		</Flex>
	)
})
