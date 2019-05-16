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
import { messages } from '../../../util/constants/defaults'
import { UpdateVersionStoreFactory } from '../../../stores/factories/UpdateVersionStoreFactory';
import { IApp } from '../../../stores/App'
import { VersionModel } from 'shared'
import { IUpdateVersionStore } from '../../../stores/UpdateVersionStore'

interface IProps {
	app: IApp
	version: VersionModel
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
	@lazyInject(nameof<UpdateVersionStoreFactory>())
	private readonly updateVersionStoreFactory: UpdateVersionStoreFactory

	private readonly store: IUpdateVersionStore

	constructor(props: IProps) {
		super(props)

		const { app, version } = props
		this.store = this.updateVersionStoreFactory(app, version)
	}

	public render() {
		const { versionModalStore } = this.store
		const { toggles } = versionModalStore

		return (
			<Modal.CloseTrigger>
				<form onSubmit={this.handleSubmit}>
					<Flex grow>
						<Flex col p list mr>
							<Input
								defaultValue={versionModalStore.versionName}
								name='versionName'
								label='Name'
							/>
							<Flex grow col>
								<label className={styles.label}>Description</label>
								<textarea
									defaultValue={this.store.description}
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
								onChange={toggles[ToggleNames.isDarwin]}
								value={versionModalStore.isDarwin}
							/>
							<ToggleRow
								label='Linux'
								icon={icons.Linux}
								onChange={toggles[ToggleNames.isLinux]}
								value={versionModalStore.isLinux}
							/>
							<ToggleRow
								label='Windows'
								icon={icons.Windows_NT}
								onChange={toggles[ToggleNames.isWindows]}
								value={versionModalStore.isWindows}
							/>
							<label>Release Options</label>
							<ToggleRow
								spread
								label='Critical'
								onChange={toggles[ToggleNames.isCritical]}
								value={versionModalStore.isCritical}
								color='red'
								message={messages.critical}
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
							<Button size='small' color='blue' type='submit'>
								<SVG src={icons.Using} />
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

		await this.store.handleUpdate({
			versionName: versionName.value,
			description: description.value,
		})
	}
}
