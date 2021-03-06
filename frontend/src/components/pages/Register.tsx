import React, { FormEvent } from 'react'
import { observer } from 'mobx-react'
import { Redirect } from 'react-router'

import Input from '../generic/Input'
import Button from '../generic/Button'
import Container from '../generic/Container'

import styles from '../../styles/LoginPage.module.sass'
import Loading from '../generic/LoadingContainer'
import Flex from '../generic/Flex'
import { passwordRegex } from 'shared'
import { IUserStore } from '../../stores/UserStore'

const errors = {
	passwordMatch: 'Your passwords do not match, please make sure they are the same.',
}

const passRegex = passwordRegex.toString().substring(1, passwordRegex.toString().length - 2)
interface IState {
	isRegistered: boolean
	errorMessage: string
}

interface IRegisterFormEvent extends FormEvent<HTMLFormElement> {
	target: EventTarget & {
		elements: {
			key: HTMLInputElement,
			name: HTMLInputElement,
			email: HTMLInputElement,
			password1: HTMLInputElement,
			password2: HTMLInputElement,
		},
	}
}

const unsuccessfulRegisterMessage = 'Invalid registration key.'

@observer
export default class Register extends React.Component<{}, IState> {
	public readonly state = {
		isRegistered: false,
		errorMessage: '',
	}

	@lazyInject(nameof<IUserStore>())
	private readonly userStore: IUserStore

	public render() {
		if (this.state.isRegistered) {
			return <Redirect to='/apps' />
		}

		if (this.userStore.isLoading) {
			return <Loading />
		}

		return (
			<Container className={styles.container}>
				<form onSubmit={this.handleRegister} className={styles.form}>
					<Flex col list>
						<h1>Sign up</h1>
						{this.state.errorMessage && (
							<div className={styles.error}>
								{this.state.errorMessage}
							</div>
						)}
						<Input
							label='key'
							type='key'
							name='key'
							required
						/>
						<Input
							type='email'
							name='email'
							label='Email'
							autoComplete='yrdyjke'
							required
						/>
						<Input
							name='name'
							label='Username'
							minLength={4}
							autoComplete='hfshkjthskr'
							required
						/>
						<Input
							type='password'
							name='password1'
							label='Password'
							autoComplete='dtukdtuk'
							pattern={passRegex}
							required
						/>
						<Input
							type='password'
							name='password2'
							label='Confirm password'
							autoComplete='dyuehje'
							pattern={passRegex}
							required
						/>
						<p>
							Your password should contain at least 1 uppercase letter,
							1 lowercase letter, a numeric digit and should be
							at least 8 characters minimum.
						</p>
						<Button color='blue' type='submit'>
							Submit
						</Button>
					</Flex>
				</form>
			</Container>
		)
	}

	@bind
	private async handleRegister(event: IRegisterFormEvent) {
		event.preventDefault()

		const { name, password1, password2, email, key } = event.target.elements

		if (password1.value === password2.value) {
			try {
				await this.userStore.register({
					name: name.value,
					email: email.value,
					password: password1.value,
					key: key.value,
				})

				this.setState({ isRegistered: true })
			} catch {
				this.setState({ errorMessage: unsuccessfulRegisterMessage })
			}
		} else {
			this.setState({ errorMessage: errors.passwordMatch })
		}
	}
}
