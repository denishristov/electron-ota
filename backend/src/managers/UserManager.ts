import User, { UserDocument, IUser } from '../models/User'
import { EventTypes } from 'shared'
import ClientSocket from '../util/ClientSocket'

import { IUserService } from '../services/UserService'


export default class UserManager {
	private readonly client: ClientSocket
	private readonly userService: IUserService

	constructor(client: ClientSocket, userService: IUserService) {
		this.client = client
		this.userService = userService

		client.subscribe(EventTypes.Login, this.userService.handleLogin)
		client.subscribe(EventTypes.Authentication, this.userService.handleAuthentication)

		// this.register({
		// 	email: 'guz@guz',
		// 	password: 'guz',
		// 	name: 'tumor'
		// })
	}

	private register(user: any): Promise<UserDocument> {
		return User.create(user)
	}
}