import { inject, observer } from 'mobx-react'
import React, { FormEvent } from 'react'

import { IUserStore } from '../../stores/UserStore'

import bind from 'bind-decorator'
import { injectUserStore } from '../../stores/RootStore'
import Input from '../Generic/Input'
import { isEmail } from '../../util/functions'
import Button from '../Generic/Button';

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
					<Input 
						label="Username"
						type='text'
						name='nameOrEmail'
						required
					/>
					<Input 
						label="Password"
						type='password'
						name='password'
						required
					/>
					<Button color='green' type='submit'>
						Submit
					</Button>
				</form>
			)
	}
}

export default inject(injectUserStore)(observer(Login))
