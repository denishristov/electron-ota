import React from 'react'
import Flex from '../../generic/Flex'
import { IClientModel, IErrorReport } from 'shared'
import Client from './Client'

import styles from '../../../styles/VersionPage.module.sass'


interface IProps {
	clients: IClientModel[]
	title: string
}

export default function ClientRow({ clients, title }: IProps) {
	return (
		<Flex column list margin className={styles.reportColumn}>
			<Flex padding spread>
				<h3>{title}</h3>
				<h4>{clients.length}</h4>
			</Flex>
			{clients.map((client) => <Client key={client.id} {...client} />)}
		</Flex>
	)
}
