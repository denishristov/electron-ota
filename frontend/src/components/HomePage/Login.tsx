import React, { FormEvent } from 'react'
import { inject, observer } from 'mobx-react'

import { IUserStore } from '../../stores/UserStore'

import './Login.css'

interface ILoginFormEvent extends FormEvent<HTMLFormElement> {
	target: EventTarget & {
		elements: {
			email: HTMLInputElement
			password: HTMLInputElement
		}
	}
}

interface ILoginProps {
	userStore: IUserStore
}

const Login = ({ userStore }: ILoginProps) => {
	const handleSubmit = (event: ILoginFormEvent): void => {
		event.preventDefault()

		const { email, password } = event.target.elements
		userStore.login(email.value, password.value)
	}

	return (
		<form onSubmit={handleSubmit}>
			<input 
				type="email"
				name="email"
				placeholder="Email"
			/>
			<input 
				type="password"
				name="password"
				placeholder="Password"
			/>
			<button type="submit">
				Submit
			</button>
		</form>
	)
}
			
export default inject(stores => ({ userStore: stores.userStore }))(observer(Login))