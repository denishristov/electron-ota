import { EventType, IUserAuthenticationRequest } from 'shared'
import { IAdminsService } from '../services/AdminsService'
import { IPreRespondHook } from '../util/mediator/Interfaces'

@DI.injectable()
export default class AuthHook implements IPreRespondHook {
	public exceptions = new Set([
		EventType.Login,
		EventType.Authentication,
		EventType.GetRegisterKeyPath,
		EventType.RegisterAdmin,
	])

	constructor(
		@DI.inject(DI.Services.Admin)
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
