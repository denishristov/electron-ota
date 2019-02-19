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
						props={{}}
					/>
					<TriggerContext.Consumer>
						{({ open }) => (
							<Menu
								id={ID}
								animation='menu-animation'
								theme='menu-theme'
							>
								<Item onClick={this.props.goHome}>Home</Item>
								<Item onClick={open}>Edit Profile</Item>
								<Separator />
								<Item onClick={this.userStore.logout}>Logout</Item>
							</Menu>
						)}
					</TriggerContext.Consumer>
				</Modal>
			</>
		)
	}
}
