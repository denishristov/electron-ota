import { observer } from 'mobx-react'
import React, { FormEvent } from 'react'

import { IUserStore } from '../../stores/UserStore'

import Input from '../generic/Input'
import { isEmail } from '../../util/functions'
import Button from '../generic/Button'
import {  RouteComponentProps, Redirect } from 'react-router'
import Flex from '../generic/Flex'

import Container from '../generic/Container'

import styles from '../../styles/LoginPage.module.sass'
import Loading from '../generic/Loading'
import icons from '../../util/constants/icons'

interface ILoginFormEvent extends FormEvent<HTMLFormElement> {
	target: EventTarget & {
		elements: {
			nameOrEmail: HTMLInputElement,
			password: HTMLInputElement,
		},
	}
}

@observer
export default class Login extends React.Component<RouteComponentProps> {
	@DI.lazyInject(DI.Stores.User)
	private readonly userStore: IUserStore

	public render() {
		if (this.userStore.isAuthenticated) {
			return <Redirect to='/apps' />
		}

		return (
			<Container className={styles.container}>
				{this.userStore.isLoading
					? <Loading />
					: (
						<form onSubmit={this.handleSubmit} className={styles.form}>
							<Flex column list>
								<h1>Sign in</h1>
								<Input
									label='Username'
									name='nameOrEmail'
									required
									icon={icons.User}
								/>
								<Input
									label='Password'
									type='password'
									name='password'
									icon={icons.Key}
									required
								/>
								<Flex list spread>
									<Button color='white' type='button' onClick={this.goToSetup}>
										Sign up
									</Button>
									<Button color='blue' type='submit'>
										Submit
									</Button>
								</Flex>
							</Flex>
						</form>
					)
				}
			</Container>
		)
	}

	@bind
	private async handleSubmit(event: ILoginFormEvent) {
		event.preventDefault()

		const { nameOrEmail, password } = event.target.elements

		const { value: input } = nameOrEmail
		const inputIsEmail = isEmail(input)

		const isSuccessful = await this.userStore.login({
			name: inputIsEmail ? void 0 : input,
			email: inputIsEmail ? input : void 0,
			password: password.value,
		})

		isSuccessful && this.props.history.push('/apps')
	}

	@bind
	private goToSetup() {
		this.props.history.push('/setup')
	}
}
