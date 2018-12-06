import User, { UserModel, IUser } from '../models/User'
import { EventTypes } from 'shared';
import bind from 'bind-decorator'
import ClientSocket from '../util/ClientSocket';

interface IUserLoginResponse {
	isLoginSuccessful: boolean
	authToken?: string
	error?: string
}

export default class UserManager {
	constructor(client: ClientSocket) {
		client.on(EventTypes.Login, this.handleLogin)

		// this.register({
		// 	email: 'guz@guz',
		// 	password: 'guz'
		// })
	}

	@bind
	public async handleLogin({ email, password }: UserModel): Promise<IUserLoginResponse> {
		try {
			const user = await User.findOne({ email }) as UserModel
			
			if (!await user.matchesPassword(password)) {
				throw new Error('Invalid password')
			}

			return { 
				isLoginSuccessful: true,
				authToken: user._id.toHexString()
			}
		} catch (error) {
			return { 
				isLoginSuccessful: false,
				error: 'Invalid password'
			}
		}
	}

	private async register(user: IUser): Promise<void> {
		User.create(user)
	}
}