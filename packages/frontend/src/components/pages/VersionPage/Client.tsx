import React from 'react'
import { ClientModel } from 'shared'

import styles from '../../../styles/VersionPage.module.sass'
import Flex from '../../generic/Flex'
import icons from '../../../util/constants/icons'
import { observer } from 'mobx-react'
import { formatDate } from '../../../util/functions'

interface IProps {
	client: ClientModel
	timestamp: string
}

export default observer(function Client({ client, timestamp }: IProps) {
	return (
		<Flex y p spread className={styles.client}>
			<Flex col list>
				<Flex>
 					<h5>{client.username}</h5>
					<label>{client.osRelease}</label>
				</Flex>
				<label>{formatDate(new Date(timestamp))}</label>
			</Flex>
			<SVG src={icons[client.systemType]} />
		</Flex>
	)
})
