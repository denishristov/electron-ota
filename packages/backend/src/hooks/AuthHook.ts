import { EventType, AuthenticatedRequest } from 'shared'
import { IAdminsService } from '../services/AdminsService'
import { IPreRespondHook } from '../util/mediator/interfaces'

export interface IAuthHook extends IPreRespondHook {
	handle(eventType: EventType, data: AuthenticatedRequest): Promise<object>
}

@DI.injectable()
export default class AuthHook implements IAuthHook {
	public exceptions = new Set([
		EventType.Login,
		EventType.Logout,
		EventType.Authentication,
		EventType.GetRegisterKeyPath,
		EventType.RegisterAdmin,
		EventType.GetProfile,
		EventType.EditProfile,
		EventType.DeleteProfile,
		EventType.ReleaseUpdate,
	])

	constructor(
		@DI.inject(DI.Services.Admin)
		private readonly userService: IAdminsService,
	) {}

	@bind
	public async handle(eventType: EventType, data: AuthenticatedRequest) {
		const { isAuthenticated } = await this.userService.authenticate(data)

		if (isAuthenticated) {
			const result = { ...data }
			delete result.authToken

			return result
		} else {
			throw new Error('Auth token is invalid')
		}
	}
}
