import React, { Component, FormEvent } from 'react'
import Modal from '../../generic/Modal'
import Flex from '../../generic/Flex'
import Input from '../../generic/Input'
import Button from '../../generic/Button'

import styles from '../../../styles/VersionModal.module.sass'
import { observer } from 'mobx-react'
import icons from '../../../util/constants/icons'

import { ToggleNames } from '../../../util/enums'
import ToggleRow from '../../generic/ToggleRow'
import { IUpdateVersionStore } from '../../../stores/UpdateVersionStore'

interface IProps {
	store: IUpdateVersionStore
}

interface IUpdateEvent extends FormEvent<HTMLFormElement> {
	target: EventTarget & {
		elements: {
			description: HTMLTextAreaElement
			versionName: HTMLInputElement,
		},
	}
}

@observer
export default class UpdateVersionModal extends Component<IProps> {
	public render() {
		return (
			<Modal.CloseTrigger>
				<form onSubmit={this.handleSubmit}>
					<Flex grow>
						<Flex col p list mr>
							<Input
								defaultValue={this.props.store.versionName}
								name='versionName'
								label='Name'
							/>
							<Flex grow col>
								<label className={styles.label}>Description</label>
								<textarea
									defaultValue={this.props.store.description}
									name='description'
									placeholder='Optional description for the update'
								/>
							</Flex>
						</Flex>
						<Flex col p list ml className={styles.switchRow}>
							<label>Supporting systems</label>
							<ToggleRow
								label='macOS'
								icon={icons.Darwin}
								onChange={this.props.store.toggles[ToggleNames.isDarwin]}
								value={this.props.store.isDarwin}
							/>
							<ToggleRow
								label='Linux'
								icon={icons.Linux}
								onChange={this.props.store.toggles[ToggleNames.isLinux]}
								value={this.props.store.isLinux}
							/>
							<ToggleRow
								label='Windows'
								icon={icons.Windows_RT}
								onChange={this.props.store.toggles[ToggleNames.isWindows]}
								value={this.props.store.isWindows}
							/>
							<label>Release Options</label>
							<ToggleRow
								spread
								label='Critical'
								onChange={this.props.store.toggles[ToggleNames.isCritical]}
								value={this.props.store.isCritical}
							/>
						</Flex>
					</Flex>
					<footer>
						<Modal.CloseTrigger>
							<Button size='small' color='white' type='button'>
								<SVG src={icons.Close} />
								Cancel
							</Button>
							</Modal.CloseTrigger>
								<Modal.CloseTrigger>
								<Button size='small' color='red' type='button' onClick={this.props.store.handleDelete}>
									<SVG src={icons.Delete} />
									Delete
								</Button>
							</Modal.CloseTrigger>
							<Button size='small' color='blue' type='submit'>
								<SVG src={icons.Success} />
								Save
							</Button>
					</footer>
				</form>
			</Modal.CloseTrigger>
		)
	}

	@bind
	private async handleSubmit(event: IUpdateEvent) {
		event.preventDefault()

		const {
			versionName,
			description,
		} = event.target.elements

		await this.props.store.handleSubmit({
			versionName: versionName.value,
			description: description.value,
		})
	}
}
