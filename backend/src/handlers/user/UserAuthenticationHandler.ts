import bind from 'bind-decorator'
import { inject, injectable } from 'inversify'
import { EventType, IUserAuthenticationRequest, IUserAuthenticationResponse } from 'shared'
import { Services } from '../../dependencies/symbols'
import { IUserService } from '../../services/UserService'
import { IHandler } from '../../util/mediator/Interfaces'

@injectable()
export default class UserAuthenticationHandler
implements IHandler<IUserAuthenticationRequest, IUserAuthenticationResponse> {
	public readonly eventType: EventType = EventType.Authentication

	constructor(
		@inject(Services.User) private readonly service: IUserService,
	) {}

	@bind
	public handle() {
		return this.service.handleAuthentication(arguments[0])
	}
}
