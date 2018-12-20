import bind from 'bind-decorator'
import { inject, injectable } from 'inversify'
import { EventType, IUserAuthenticationResponse, IUserLoginRequest } from 'shared'
import { Services } from '../../dependencies/symbols'
import { IUserService } from '../../services/UserService'
import { IHandler } from '../../util/mediator/Interfaces'

@injectable()
export default class UserLoginHandler implements IHandler<IUserLoginRequest, IUserAuthenticationResponse> {
	public readonly eventType: EventType = EventType.Login

	@inject(Services.User)
	private readonly service: IUserService

	@bind
	public handle() {
		return this.service.handleLogin(arguments[0])
	}
}
