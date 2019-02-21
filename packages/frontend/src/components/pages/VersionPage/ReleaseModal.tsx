import React from 'react'
import Flex from '../../generic/Flex'
import Input from '../../generic/Input'
import Modal from '../../generic/Modal'
import Button from '../../generic/Button'
import icons from '../../../util/constants/icons'
import { IReleaseVersionEvent } from '.'

interface IProps {
	onSubmit: (event: IReleaseVersionEvent) => void
}

export default function ReleaseModal({ onSubmit }: IProps) {
	return (
		<Modal.CloseTrigger>
			<form onSubmit={onSubmit}>
				<Flex m x y>
					<Input type='password' name='password' label='password' required />
				</Flex>
				<footer>
					<Modal.CloseTrigger>
						<Button size='small' color='white' type='button'>
							<SVG src={icons.Close} />
							Cancel
						</Button>
					</Modal.CloseTrigger>
					<Button
						size='small'
						color='blue'
						type='submit'
					>
						<SVG src={icons.Upload} />
						Submit
					</Button>
				</footer>
			</form>
		</Modal.CloseTrigger>
	)
}
