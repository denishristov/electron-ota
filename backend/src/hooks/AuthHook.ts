import { IPreRespondHook } from '../mediator/Interfaces'
import { EventType, IUserAuthenticationRequest } from 'shared'
import { IAdminsService } from '../services/AdminsService'

@DI.injectable()
export default class AuthHook implements IPreRespondHook {
	public exceptions = new Set([
		EventType.Login,
		EventType.Authentication,
		EventType.RegisterKeyPath,
		EventType.RegisterKeyAuth,
		EventType.Register,
	])

	constructor(
		@DI.inject(DI.Services.User)
		private readonly userService: IAdminsService,
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
