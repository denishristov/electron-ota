import React, { FormEvent } from 'react'
import { inject, observer } from 'mobx-react'
import { injectRegisterStore } from '../../stores/RootStore'
import { IRegisterStore } from '../../stores/RegisterStore'
import { Redirect } from 'react-router';
import { copyToClipboard } from '../../util/functions'
import Input from '../Generic/Input'
import Button from '../Generic/Button'

interface IProps {
	registerStore: IRegisterStore
}

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
	private async handleRegister(event: IRegisterFormEvent) {
		event.preventDefault()

		const { name, password1, password2, email, key } = event.target.elements

		if (password1.value === password2.value) {
			const isRegistered = await this.props.registerStore.registerAdmin({
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

	// tslint:disable-next-line:member-ordering
	public render() {
		if (this.state.isRegistered) {
			return <Redirect to='/apps' />
		}

		if (this.props.registerStore.isLoading) {
			return <div>Loading...</div>
		}

		return (
			<form onSubmit={this.handleRegister}>
				<h1>Sign up</h1>
				<label>Key path</label>
				<code className='key-path' onClick={this.handleCopyCommand}>
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
					type='text'
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
				<Button color='green' type='submit'>
					Submit
				</Button>
			</form>
		)
	}
}

export default inject(injectRegisterStore)(observer(Register))
