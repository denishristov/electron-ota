import React from 'react';
import { inject, observer } from 'mobx-react'
import { ILoginFormElement, ILoginProps } from './Interfaces'

import './Login.css';

function Login({ userStore }: ILoginProps) {
	function handleSubmit(event: ILoginFormElement): void {
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
			

export default inject('userStore')(observer(Login));