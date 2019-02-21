import React from 'react'
import { Report } from 'shared'

import styles from '../../../styles/VersionPage.module.sass'
import Flex from '../../generic/Flex'
import Pushable from '../../generic/Pushable'
import Modal from '../../generic/Modal'
import { observer } from 'mobx-react'
import Button from '../../generic/Button'
import icons from '../../../util/constants/icons'
import Client from './Client'

const ErrorModal = ({ errorMessage }: { errorMessage?: string }) => (
	<>
		<code>{errorMessage}</code>
		<footer>
			<Modal.CloseTrigger>
				<Button size='small' color='white' type='button'>
					<SVG src={icons.Close} />
					Cancel
				</Button>
			</Modal.CloseTrigger>
		</footer>
	</>
)

export default observer(function Report({ client, errorMessage }: Report) {
	return (
		<Modal>
			<Modal.OpenTrigger>
				<div>
					<Pushable>
						<Client client={client} />
					</Pushable>
				</div>
			</Modal.OpenTrigger>
			{errorMessage && (
				<Modal.Content
					title='Error'
					className={styles.errorModal}
					component={ErrorModal}
					props={{ errorMessage }}
				/>
			)}
		</Modal>
	)
})
