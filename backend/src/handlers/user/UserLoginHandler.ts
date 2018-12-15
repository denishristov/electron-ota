import { IHandler } from "../../util/mediator/Interfaces"
import { EventType, IUserLoginRequest, IUserAuthenticationResponse } from "shared";
import { IUserService } from "../../services/UserService";
import { inject, injectable } from "inversify";
import { Services } from "../../dependencies/symbols";
import bind from "bind-decorator";

@injectable()
export default class UserLoginHandler implements IHandler<IUserLoginRequest, IUserAuthenticationResponse> {
	@inject(Services.User)
	private readonly service: IUserService
	
	readonly eventType: EventType = EventType.Login
	
	@bind
	handle() {
		return this.service.handleLogin(arguments[0])
	}
}