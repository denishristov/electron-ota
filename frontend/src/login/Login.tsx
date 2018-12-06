import React, { Component, FormEvent } from 'react';
import { inject, observer } from 'mobx-react'
import UserStore from '../stores/UserStore'

import './Login.css';

interface ILoginProps {
	userStore: UserStore
}

interface ILoginFormElements extends HTMLFormControlsCollection {
	email: HTMLInputElement
	password: HTMLInputElement
}

function Login({ userStore }: ILoginProps){
	function handleSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault()

		const form = event.target as HTMLFormElement
		const { email, password } = form.elements as ILoginFormElements

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
