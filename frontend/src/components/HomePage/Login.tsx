import { inject, observer } from 'mobx-react'
import React, { FormEvent } from 'react'

import { IUserStore } from '../../stores/UserStore'

import bind from 'bind-decorator'
import { injectUserStore } from '../../stores/RootStore'

interface ILoginFormEvent extends FormEvent<HTMLFormElement> {
	target: EventTarget & {
		elements: {
			nameOrEmail: HTMLInputElement
			password: HTMLInputElement,
		},
	}
}

interface ILoginProps {
	userStore: IUserStore
}

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

function isEmail(candidate: string): boolean {
	return emailRegex.test(candidate)
}

class Login extends React.Component<ILoginProps> {
	@bind
	public handleSubmit(event: ILoginFormEvent): void {
		event.preventDefault()

		const { nameOrEmail, password } = event.target.elements

		const { value: input } = nameOrEmail
		const inputIsEmail = isEmail(input)

		this.props.userStore.login({
			name: inputIsEmail ? void 0 : input,
			email: inputIsEmail ? input : void 0,
			password: password.value
		})
	}

	public render() {
		return this.props.userStore.isLoading
			? <div>Loading...</div>
			: (
				<form onSubmit={this.handleSubmit}>
				<h1>Sign in</h1>
					<label>Username</label>
					<div className='input-container'>
						<input
							type='text'
							name='nameOrEmail'
						/>
						<div className='input-bar' />
					</div>
					<label>Password</label>
					<div className='input-container'>
						<input
							type='password'
							name='password'
						/>
						<div className='input-bar' />
					</div>
					<button className='green' type='submit'>
						Submit
					</button>
				</form>
			)
	}
}

export default inject(injectUserStore)(observer(Login))
