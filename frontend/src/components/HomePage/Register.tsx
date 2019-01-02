import React, { FormEvent } from 'react'
import { inject, observer } from 'mobx-react'
import { injectRegisterStore } from '../../stores/RootStore'
import { IRegisterStore } from '../../stores/RegisterStore'
import { Redirect } from 'react-router';

interface IProps {
	registerStore: IRegisterStore
}

interface IState {
	isRegistered: boolean
}

interface IAuthenticateFormEvent extends FormEvent<HTMLFormElement> {
	target: EventTarget & {
		elements: {
			key: HTMLInputElement,
		},
	}
}

interface IRegisterFormEvent extends FormEvent<HTMLFormElement> {
	target: EventTarget & {
		elements: {
			name: HTMLInputElement,
			email: HTMLInputElement,
			password1: HTMLInputElement,
			password2: HTMLInputElement,
		},
	}
}

function copyToClipboard(text: string) {
	const el = document.createElement('textarea')
	el.value = text
	document.body.appendChild(el)
	el.select()
	document.execCommand('copy')
	document.body.removeChild(el)
}

class Register extends React.Component<IProps, IState> {
	state = {
		isRegistered: false,
	}

	private get command() {
		return `cat ${this.props.registerStore.path}`
	}

	public componentDidMount() {
		this.props.registerStore.fetchKeyPath()
	}

	@bind
	private handleAuthenticate(event: IAuthenticateFormEvent) {
		event.preventDefault()

		this.props.registerStore.authenticateRegisterAdmin(event.target.elements.key.value)
	}

	@bind
	private async handleRegister(event: IRegisterFormEvent) {
		event.preventDefault()

		const { name, password1, password2, email } = event.target.elements

		if (password1.value === password2.value) {
			const isRegistered = await this.props.registerStore.registerAdmin({
				name: name.value,
				email: email.value,
				password: password1.value,
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

	// tslint:disable-next-line:member-ordering
	public render() {
		if (this.state.isRegistered) {
			return <Redirect to='/apps' />
		}

		if (this.props.registerStore.isLoading) {
			return <div>Loading...</div>
		}

		return this.props.registerStore.isAuthenticated
		? <form onSubmit={this.handleRegister}>
			<input
				type='email'
				name='email'
				placeholder='Email'
			/>
			<input
				type='text'
				name='name'
				placeholder='Username'
			/>
			<input
				type='password'
				name='password1'
				placeholder='Password'
			/>
			{/* <input
				type='password'
				name='password2'
				placeholder='Confirm password'
			/> */}
			<button type='submit'>
				Submit
			</button>
		</form>
		: <form onSubmit={this.handleAuthenticate}>
			<h1>Key path</h1>
			<code>
				{this.command}
			</code>
			<div onClick={this.handleCopyCommand}>
				Copy
			</div>
			<input
				type='text'
				name='key'
				placeholder='Key'
			/>
			<button type='submit'>
				Submit
			</button>
		</form>
	}
}

export default inject(injectRegisterStore)(observer(Register))
