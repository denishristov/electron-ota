import { action } from 'mobx'
import UserAPI from './UserAPI'
import { FormEvent } from 'react'
import bind from 'bind-decorator'

export default class UserStore {
	private readonly api: UserAPI
	// @action.bound handleSubmit(event: FormEvent<HTMLFormElement>) {
	// 	event.preventDefault()
		
	// }
	constructor(api: UserAPI) {
		this.api = api
	}

	@bind 
	handleSubmit(event: FormEvent<HTMLFormElement>): void {
		event.preventDefault()

		const form = event.target as HTMLFormElement
		const elements = form.elements as any

		const email = (elements.email as HTMLInputElement).value
		const password = (elements.password as HTMLInputElement).value

		this.api.login(email, password)
	}
}