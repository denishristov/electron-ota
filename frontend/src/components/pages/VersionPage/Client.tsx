import React from 'react'
import { ClientModel } from 'shared'

import styles from '../../../styles/VersionPage.module.sass'
import Flex from '../../generic/Flex'
import icons from '../../../util/constants/icons'
import { observer } from 'mobx-react'
import { capitalize } from '../../../util/functions'
import Tip from '../../generic/Tip'
import { actionColors } from '../../../util/constants/defaults'
import { format } from 'timeago.js'

interface IProps {
	client: ClientModel
	timestamp: string
	type: string
	onClick?: () => void
}

export default observer(function Client({ client, timestamp, type, onClick }: IProps) {
	return (
		<Flex key={client.id + type} className={styles.client} list y onClick={onClick}>
			<Tip message={capitalize(type)}>
				<SVG
					className={styles.actionType}
					src={icons[capitalize(type)]}
					style={{ backgroundColor: actionColors[type] }}
				/>
			</Tip>
			<h6>
				{format(new Date(timestamp))}
			</h6>
			<h5>{client.username}</h5>
			<Flex grow />
			<label>{client.osRelease}</label>
			<SVG src={icons[client.systemType]} />
		</Flex>
	)
})
