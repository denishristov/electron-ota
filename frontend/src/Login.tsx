import React, { Component, FormEvent } from 'react';
import { inject, observer } from 'mobx-react'
import UserStore from './stores/UserStore'

import './Login.css';

interface ILoginProps {
	userStore: UserStore
}

function Login({ userStore }: ILoginProps){
	return <form onSubmit={userStore.handleSubmit}>
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
}
			

export default inject('userStore')(observer(Login));
