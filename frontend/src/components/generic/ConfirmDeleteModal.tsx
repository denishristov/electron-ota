import React, { ReactElement } from 'react'
import Modal from './Modal'
import Button from './Button'
import icons from '../../util/constants/icons'
import { TriggerContext } from '../contexts/ModalContext'

interface IProps extends IContentProps {
	children: (open: () => void) => ReactElement<{}>
}

interface IContentProps {
	onDelete: () => void
	name: string
}

function Content({ onDelete, name }: IContentProps) {
	return (
		<>
			<h3>Are you sure you want to delete {name} ?</h3>
			<footer>
				<Modal.CloseTrigger>
					<Button size='small' color='white' type='button'>
						<SVG src={icons.Close} />
						Cancel
					</Button>
				</Modal.CloseTrigger>
				<Modal.CloseTrigger>
					<div>
						<Button size='small' color='red' type='button' onClick={onDelete}>
							<SVG src={icons.Delete} />
							Confirm
						</Button>
					</div>
				</Modal.CloseTrigger>
			</footer>
		</>
	)
}

export default function ConfirmDeleteModal({ children, ...props }: IProps) {
	return (
		<Modal>
			<TriggerContext.Consumer>
				{({ open }) => children(open)}
			</TriggerContext.Consumer>
			<Modal.Content
				component={Content}
				props={props}
			/>
		</Modal>
	)
}
