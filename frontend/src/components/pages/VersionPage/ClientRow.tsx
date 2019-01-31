import React from 'react'
import Flex from '../../generic/Flex'
import styles from '../../../styles/VersionPage.module.sass'
import { observer } from 'mobx-react'

interface IProps<T> {
	clients: T[]
	mapper: (x: T) => JSX.Element
	title: string
	icon: string
}

export default observer(function ClientRow<T>({ clients, title, mapper, icon }: IProps<T>) {
	return (
		<Flex column list margin padding className={styles.reportColumn}>
			<Flex pb spread>
				<Flex>
					<h3>{title}</h3>
					<SVG src={icon} />
				</Flex>
				<h4>{clients.length}</h4>
			</Flex>
			{clients.map(mapper)}
		</Flex>
	)
})
