import { observer } from 'mobx-react'
import React, { FormEvent } from 'react'

import { IUserStore } from '../../stores/UserStore'

import Input from '../generic/Input'
import { isEmail, list } from '../../util/functions'
import Button from '../generic/Button'
import {  RouteComponentProps, Redirect } from 'react-router'
import Flex from '../generic/Flex'

import Container from '../generic/Container'

import styles from '../../styles/LoginPage.module.sass'
import icons from '../../util/constants/icons'
import LoadingContainer from '../generic/LoadingContainer'

interface ILoginFormEvent extends FormEvent<HTMLFormElement> {
	target: EventTarget & {
		elements: {
			nameOrEmail: HTMLInputElement,
			password: HTMLInputElement,
		},
	}
}

interface IState {
	errorMessage: string
}

const unsuccessfulLoginMessage = 'You have entered an invalid username/email or password.'

@observer
export default class Login extends React.Component<RouteComponentProps, IState> {
	public state = {
		errorMessage: '',
	}

	@lazyInject(nameof<IUserStore>())
	private readonly userStore: IUserStore

	public render() {
		if (this.userStore.isAuthenticated) {
			return <Redirect to='/apps' />
		}

		return (
			<Container className={styles.container}>
				{this.userStore.isLoading
					? <LoadingContainer />
					: (
						<form
							onSubmit={this.handleSubmit}
							className={list(styles.form, styles.loginForm)}
						>
							<Flex col list>
								<h1>Sign in</h1>
								<Input
									label='Username or Email'
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
								{this.state.errorMessage && (
									<div className={styles.error}>
										{this.state.errorMessage}
									</div>
								)}
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

		try {
			await this.userStore.login({
				name: inputIsEmail ? void 0 : input,
				email: inputIsEmail ? input : void 0,
				password: password.value,
			})

			this.props.history.push('/apps')
		} catch {
			this.setState({ errorMessage: unsuccessfulLoginMessage })
		}
	}

	@bind
	private goToSetup() {
		this.props.history.push('/setup')
	}
}
