import React, { Component } from 'react'

import icons from '../../../util/constants/icons'
import styles from '../../../styles/AppsPage.module.sass'
import Flex from '../../generic/Flex'
import '../../../styles/Menu.sass'

import { Menu, Item, Separator, Submenu, MenuProvider } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css'

import { IUserStore } from '../../../stores/UserStore'
import Modal from '../../generic/Modal'
import Pushable from '../../generic/Pushable'
import { OpenTrigger, TriggerContext } from '../../contexts/ModalContext'
import ProfileModal from '../../modals/ProfileModal'

const ID = 'profile'

export default class Profile extends Component {
	@DI.lazyInject(DI.Stores.User)
	private readonly userStore: IUserStore

	public render() {
		const { profile } = this.userStore

		return Boolean(profile) && (
			<>
				<MenuProvider id={ID} event='onClick'>
					<div>
						<Pushable>
							<Flex y list className={styles.profile}>
								<h5>{profile.name}</h5>
								{profile.pictureUrl
									? <img src={profile.pictureUrl} />
									: <SVG src={icons.User} />
								}
							</Flex>
						</Pushable>
					</div>
				</MenuProvider>
				<Modal>
					<Modal.Content
						title='Edit profile'
						component={ProfileModal}
					/>
					<TriggerContext.Consumer>
						{({ open }) => (
							<Menu
								id={ID}
								animation='menu-animation'
								theme='menu-theme'
							>
								<Item onClick={open}>Edit Profile</Item>
								<Item onClick={this.userStore.logout}>Logout</Item>
							</Menu>
						)}
					</TriggerContext.Consumer>
				</Modal>
			</>
		)
	}
}
