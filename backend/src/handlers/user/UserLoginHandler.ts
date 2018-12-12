import { IHandler } from "../../util/mediator/Interfaces"
import { EventType, IUserLoginRequest, IUserAuthenticationResponse } from "shared";
import bind from "bind-decorator";
import { IUserService } from "../../services/UserService";

export default class UserLoginHandler implements IHandler<IUserLoginRequest, IUserAuthenticationResponse> {
	readonly eventType: EventType = EventType.Login
	
	constructor(private readonly service: IUserService) {}

	@bind
	handle(req: IUserLoginRequest) {
		return this.service.handleLogin(req)
	}
}