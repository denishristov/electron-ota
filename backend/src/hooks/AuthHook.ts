import { IPreRespondHook } from '../mediator/Interfaces'
import { EventType, IUserAuthenticationRequest, IUserAuthenticationResponse } from 'shared'
import { IUserService } from '../services/UserService'

interface IAuthHandler {
	handle(req: IUserAuthenticationRequest): Promise<IUserAuthenticationResponse>
}

@DI.injectable()
export default class AuthHook implements IPreRespondHook {
	public exceptions = new Set([EventType.Login, EventType.Authentication, EventType.Connection])

	constructor(
		@DI.inject(DI.Services.User) private readonly userService: IUserService,
	) {}

	@bind
	public async handle(data: IUserAuthenticationRequest) {
		const { isAuthenticated } = await this.userService.authenticate(data)

		if (isAuthenticated) {
			const result = { ...data }
			delete result.authToken
			return result
		} else {
			return {
				errorMessage: 'Auth token is invalid',
			}
		}
	}
}
