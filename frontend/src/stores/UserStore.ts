import { action } from 'mobx'
import UserAPI from './UserAPI'
import { FormEvent } from 'react'
import bind from 'bind-decorator'

export default class UserStore {
	private readonly api: UserAPI

	constructor(api: UserAPI) {
		this.api = api
	}

	@action.bound 
	login(email: string, password: string): void {
		this.api.login(email, password)
	}
}