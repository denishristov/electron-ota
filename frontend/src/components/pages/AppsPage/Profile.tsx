import React, { Component } from 'react'

import icons from '../../../util/constants/icons'
import styles from '../../../styles/AppsPage.module.sass'

import Flex from '../../generic/Flex'

import { Menu, Item, Separator, Submenu, MenuProvider } from 'react-contexify'
import 'react-contexify/dist/ReactContexify.min.css'
import { IUserStore } from '../../../stores/UserStore'
import Modal from '../../generic/Modal';

const ID = 'profile'

export default class Profile extends Component {
	@DI.lazyInject(DI.Stores.User)
	private readonly userStore: IUserStore

	public render() {
		return (
			<>
				<MenuProvider id={ID}>
					<Flex margin centerY list className={styles.profile}>
						<h5>{'pesho'}</h5>
						<SVG src={icons.User} />
					</Flex>
				</MenuProvider>
				<Menu id={ID} animation='pop' theme='light'>
					<Item>Edit Profile</Item>
					<Item onClick={this.userStore.logout}>Logout</Item>
					<Separator />
					<Item disabled>Dolor</Item>
					<Separator />
				</Menu>
			</>
		)
	}
}
