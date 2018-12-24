import { IPreRespondHook } from '../../util/mediator/Interfaces'
import { EventType, IUserAuthenticationRequest, IUserAuthenticationResponse } from 'shared'
import bind from 'bind-decorator'
import { inject } from 'inversify'
import { Handlers } from '../../dependencies/symbols'

interface IAuthHandler {
	handle(req: IUserAuthenticationRequest): Promise<IUserAuthenticationResponse>
}

export default class AuthHook implements IPreRespondHook {
	public exceptions = [EventType.Login, EventType.Authentication, EventType.Connection]

	constructor(
		@inject(Handlers.User.Authentication) private readonly authHandler: IAuthHandler,
	) {}

	@bind
	public async handle(_: EventType, data: IUserAuthenticationRequest) {
		const { isAuthenticated } = await this.authHandler.handle(data)

		if (isAuthenticated) {
			return data
		} else {
			return {
				errorMessage: 'Auth token is invalid',
			}
		}
	}
}
