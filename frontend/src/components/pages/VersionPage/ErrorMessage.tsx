import React from 'react'
import { ErrorReport } from 'shared'

import styles from '../../../styles/VersionPage.module.sass'
import Flex from '../../generic/Flex'
import Pushable from '../../generic/Pushable'
import Modal from '../../generic/Modal'
import { observer } from 'mobx-react'
import Button from '../../generic/Button'
import icons from '../../../util/constants/icons'

const ErrorModal = ({ errorMessage }: { errorMessage: string }) => (
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

export default observer(function ErrorMessage({ client, errorMessage }: ErrorReport) {
	return (
		<Modal>
			<Modal.OpenTrigger>
				<div>
					<Pushable>
						<Flex y p className={styles.client}>
							<Flex y grow>
								<h5>{client.username}</h5>
								<label>{client.osRelease}</label>
								<SVG src={icons[client.systemType]} />
							</Flex>
							<h6>{errorMessage}</h6>
						</Flex>
					</Pushable>
				</div>
			</Modal.OpenTrigger>
			<Modal.Content
				title='Error'
				className={styles.errorModal}
				component={ErrorModal}
				props={{ errorMessage }}
			/>
		</Modal>
	)
})
