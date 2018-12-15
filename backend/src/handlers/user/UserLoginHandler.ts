import { IHandler } from "../../util/mediator/Interfaces"
import { EventType, IUserLoginRequest, IUserAuthenticationResponse } from "shared";
import { IUserService } from "../../services/UserService";
import { inject } from "inversify";
import { SERVICES } from "../../dependencies/symbols";
import bind from "bind-decorator";

export default class UserLoginHandler implements IHandler<IUserLoginRequest, IUserAuthenticationResponse> {
	@inject(SERVICES.USER)
	private readonly service: IUserService
	
	readonly eventType: EventType = EventType.Login
	
	@bind
	handle() {
		return this.service.handleLogin(arguments[0])
	}
}