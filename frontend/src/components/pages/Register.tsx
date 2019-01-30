import React, { FormEvent } from 'react'
import { observer } from 'mobx-react'
import { IRegisterStore } from '../../stores/RegisterStore'
import { Redirect } from 'react-router'
import { copyToClipboard } from '../../util/functions'
import Input from '../generic/Input'
import Button from '../generic/Button'
import Container from '../generic/Container'

import styles from '../../styles/LoginPage.module.sass'
import Loading from '../generic/Loading'
import Flex from '../generic/Flex'

interface IState {
	isRegistered: boolean
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

@observer
export default class Register extends React.Component<{}, IState> {
	public readonly state = {
		isRegistered: false,
	}

	@DI.lazyInject(DI.Stores.User)
	private readonly registerStore!: IRegisterStore

	private get command() {
		return `cat ${this.registerStore.path}`
	}

	public componentDidMount() {
		this.registerStore.fetchKeyPath()
	}

	public render() {
		if (this.state.isRegistered) {
			return <Redirect to='/apps' />
		}

		if (this.registerStore.isLoading) {
			return <Loading />
		}

		return (
			<Container>
				<form onSubmit={this.handleRegister}>
					<Flex column list>
						<h1>Sign up</h1>
						<label>Key path</label>
						<code className={styles.keyPath} onClick={this.handleCopyCommand}>
							{this.command}
						</code>
						<Input
							label='key'
							type='password'
							name='key'
						/>
						<Input
							type='email'
							name='email'
							label='Email'
						/>
						<Input
							name='name'
							label='Username'
						/>
						<Input
							type='password'
							name='password1'
							label='Password'
						/>
						<Input
							type='password'
							name='password2'
							label='Confirm password'
						/>
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
			const isRegistered = await this.registerStore.registerAdmin({
				name: name.value,
				email: email.value,
				password: password1.value,
				key: key.value,
			})

			if (isRegistered) {
				this.setState({ isRegistered })
			}
		}
	}

	@bind
	private handleCopyCommand() {
		copyToClipboard(this.command)
	}
}
