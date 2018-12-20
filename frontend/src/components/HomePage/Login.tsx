import { inject, observer } from 'mobx-react'
import React, { FormEvent } from 'react'

import { IUserStore } from '../../stores/UserStore'

import bind from 'bind-decorator'
import { injectUserStore } from '../../stores/RootStore'
import './Login.css'

interface ILoginFormEvent extends FormEvent<HTMLFormElement> {
	target: EventTarget & {
		elements: {
			email: HTMLInputElement
			password: HTMLInputElement,
		},
	}
}

interface ILoginProps {
	userStore: IUserStore
}

class Login extends React.Component<ILoginProps> {
	@bind
	public handleSubmit(event: ILoginFormEvent): void {
		event.preventDefault()

		const { email, password } = event.target.elements
		this.props.userStore.login(email.value, password.value)
	}

	public render() {
		return this.props.userStore.isLoading
			? <div>Loading...</div>
			: (
				<form onSubmit={this.handleSubmit}>
					<input
						type='email'
						name='email'
						placeholder='Email'
					/>
					<input
						type='password'
						name='password'
						placeholder='Password'
					/>
					<button type='submit'>
						Submit
					</button>
				</form>
			)
	}
}

export default inject(injectUserStore)(observer(Login))
