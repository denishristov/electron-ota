import { inject, observer } from 'mobx-react'
import React, { FormEvent } from 'react'

import { IUserStore } from '../../stores/UserStore'

import { injectUserStore } from '../../stores/RootStore'
import Input from '../Generic/Input'
import { isEmail } from '../../util/functions'
import Button from '../Generic/Button'
import { Redirect, RouterProps } from 'react-router'
import Row from '../Generic/Row'

import User from '../../img/User.svg'
import Key from '../../img/Key.svg'

interface ILoginFormEvent extends FormEvent<HTMLFormElement> {
	target: EventTarget & {
		elements: {
			nameOrEmail: HTMLInputElement
			password: HTMLInputElement,
		},
	}
}

interface IProps extends RouterProps {
	userStore: IUserStore
}

interface IState {
	isSuccessful: boolean
}

class Login extends React.Component<IProps, IState> {
	state = {
		isSuccessful: false,
	}

	@bind
	public async handleSubmit(event: ILoginFormEvent) {
		event.preventDefault()

		const { nameOrEmail, password } = event.target.elements

		const { value: input } = nameOrEmail
		const inputIsEmail = isEmail(input)

		const isSuccessful = await this.props.userStore.login({
			name: inputIsEmail ? void 0 : input,
			email: inputIsEmail ? input : void 0,
			password: password.value
		})

		this.setState({ isSuccessful })
	}

	@bind
	private goToSetup() {
		this.props.history.push('/setup')
	}

	public render() {
		if (this.state.isSuccessful) {
			return <Redirect to='/apps' />
		}

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
						icon={User}
					/>
					<Input 
						label="Password"
						type='password'
						name='password'
						icon={Key}
						required
					/>
					<Row>
						<Button color='grey' onClick={this.goToSetup}>
							Sign up
						</Button>
						<Button color='green' type='submit'>
							Submit
						</Button>
					</Row>
				</form>
			)
	}
}

export default inject(injectUserStore)(observer(Login))
