import React, { FormEvent } from 'react'
import { observer } from 'mobx-react'

import Modal from '../../generic/Modal'
import Flex from '../../generic/Flex'
import Input from '../../generic/Input'
import Button from '../../generic/Button'

import styles from '../../../styles/AppsPage.module.sass'

import icons from '../../../util/constants/icons'
import PictureUpload from '../../generic/PictureUpload'
import { colors } from '../../../util/constants/styles'
import { ICreateAppStore } from '../../../stores/CreateAppStore'
import { gradient, list } from '../../../util/functions'
import Pushable from '../../generic/Pushable';

interface ICreateAppEvent extends FormEvent<HTMLFormElement> {
	target: EventTarget & {
		elements: {
			name: HTMLInputElement
			bundleId: HTMLInputElement,
		},
	}
}

@observer
export default class CreateAppModal extends React.Component {
	@lazyInject(nameof<ICreateAppStore>())
	private readonly store: ICreateAppStore

	public render() {
		const {
			pictureSrc,
			handleSelectPicture,
			colorSetters,
			color,
		} = this.store.appModalStore

		return (
			<Modal.CloseTrigger>
				<form onSubmit={this.handleCreateApp} className={styles.newApp}>
					<Flex fill mt mb>
						<Flex m col y>
							<PictureUpload
								label='Upload icon'
								picture={pictureSrc}
								onDrop={handleSelectPicture}
							/>
						</Flex>
						<Flex ml mr />
						<Flex m col list>
							<Input name='name' label='Name' required />
							<Input name='bundleId' label='Bundle ID' required />
							<label>Color</label>
							<Flex list col>
								<Flex list>
									{Object.values(colors.data)
										.map((backgroundColor) => (
											<Pushable key={backgroundColor}>
												<div
													className={list(styles.color, color === backgroundColor && styles.selected)}
													style={gradient(backgroundColor)}
													onClick={colorSetters[backgroundColor]}
												>
													<SVG src={icons.Using} />
												</div>
											</Pushable>
										))
									}
								</Flex>
							</Flex>
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
							<SVG src={icons.Plus} />
							Add
						</Button>
					</footer>
				</form>
			</Modal.CloseTrigger>
		)
	}

	@bind
	private async handleCreateApp(event: ICreateAppEvent) {
		event.preventDefault()

		const { name, bundleId } = event.target.elements

		await this.store.handleCreate({
			name: name.value,
			bundleId: bundleId.value,
		})
	}
}
