import React, { Component } from 'react'

import icons from '../../../util/constants/icons'
import styles from '../../../styles/AppsPage.module.sass'
import Flex from '../../generic/Flex'

import { Menu, Item, Separator, Submenu, MenuProvider } from 'react-contexify'

import { IUserStore } from '../../../stores/UserStore'
import Modal from '../../generic/Modal'
import Pushable from '../../generic/Pushable'
import { TriggerContext } from '../../contexts/ModalContext'
import ProfileModal from './ProfileModal'
import { observer } from 'mobx-react'
import ConfirmDeleteModal from '../../generic/ConfirmDeleteModal'

const ID = 'profile'

interface IProps {
	goHome(): void
}

@observer
export default class Profile extends Component<IProps> {
	@DI.lazyInject(DI.Stores.User)
	private readonly userStore: IUserStore

	public render() {
		const { profile, isAuthenticated } = this.userStore

		return Boolean(profile) && isAuthenticated && (
			<>
				<MenuProvider id={ID} event='onClick'>
					<Pushable>
						<Flex y list className={styles.profile}>
							<h5>{profile.name}</h5>
							{profile.pictureUrl
								? <img src={profile.pictureUrl} />
								: <SVG src={icons.User} />
							}
						</Flex>
					</Pushable>
				</MenuProvider>
				<Modal>
					<Modal.Content
						title='Edit profile'
						component={ProfileModal}
						props={{}}
					/>
					<TriggerContext.Consumer>
					{({ open }) => (
						<ConfirmDeleteModal name='your profile' onDelete={this.userStore.deleteProfile}>
							{(openDelete) => (
								<Menu
									id={ID}
									animation='menu-animation'
									theme='menu-theme'
								>
									<Item onClick={this.props.goHome}>Home</Item>
									<Separator />
									<Item onClick={open}>Edit Profile</Item>
									<Item onClick={openDelete}>Delete Profile</Item>
									<Separator />
									<Item onClick={this.userStore.logout}>Logout</Item>
								</Menu>
							)}
						</ConfirmDeleteModal>
					)}
					</TriggerContext.Consumer>
				</Modal>
			</>
		)
	}
}
