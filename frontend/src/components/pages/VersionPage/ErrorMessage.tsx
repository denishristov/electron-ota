import React from 'react'
import { ErrorReport } from 'shared'

import Windows from '../../../img/Windows.svg'
import Apple from '../../../img/Apple.svg'
import Ubuntu from '../../../img/Ubuntu.svg'

import styles from '../../../styles/VersionPage.module.sass'
import Flex from '../../generic/Flex'
import Pushable from '../../generic/Pushable'
import Modal from '../../generic/Modal'
import { observer } from 'mobx-react'

const icons = {
	Darwin: Apple,
	Windows_RT: Windows,
	Linux: Ubuntu,
}

const ErrorModal = ({ errorMessage }: { errorMessage: string }) => <code>{errorMessage}</code>

export default observer(function ErrorMessage({ client, errorMessage }: ErrorReport) {
	return (
		<Modal>
			<Modal.OpenTrigger>
				<div>
					<Pushable>
						<Flex centerY padding className={styles.client}>
							<Flex centerY grow>
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
