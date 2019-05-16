import React, { Component, FormEvent } from 'react'
import Modal from '../../generic/Modal'
import Flex from '../../generic/Flex'
import PictureUpload from '../../generic/PictureUpload'
import Input from '../../generic/Input'
import { colors } from '../../../util/constants/styles'
import icons from '../../../util/constants/icons'
import Button from '../../generic/Button'

import styles from '../../../styles/AppsPage.module.sass'
import { IUpdateAppStore } from '../../../stores/UpdateAppStore'
import { observer } from 'mobx-react'

interface IEditAppEvent extends FormEvent<HTMLFormElement> {
	target: EventTarget & {
		elements: {
			name: HTMLInputElement,
		},
	}
}

interface IProps {
	id: string
	pictureSrc?: string
	name: string
	color: string
}

@observer
export default class UpdateAppModal extends Component<IProps> {
	@lazyInject(nameof<IUpdateAppStore>())
	private readonly store: IUpdateAppStore

	public componentDidMount() {
		const { pictureSrc, color } = this.props

		Object.assign(this.store.appModalStore, { pictureSrc, color })
	}

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
							<Input defaultValue={this.props.name} name='name' label='Name' />
							<label>Color</label>
							<Flex list col>
								<Flex list>
									{Object.values(colors.data).map((backgroundColor) => (
										<div
											key={backgroundColor}
											className={styles.color}
											style={{ backgroundColor }}
											onClick={colorSetters[backgroundColor]}
										>
											{color === backgroundColor && (
												<SVG src={icons.Using} />
											)}
										</div>
									))}
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
							<SVG src={icons.Using} />
							Save
						</Button>
					</footer>
				</form>
			</Modal.CloseTrigger>
		)
	}

	@bind
	private async handleCreateApp(event: IEditAppEvent) {
		event.preventDefault()

		const { name } = event.target.elements

		await this.store.handleEdit({
			name: name && name.value,
			id: this.props.id,
		})
	}
}
