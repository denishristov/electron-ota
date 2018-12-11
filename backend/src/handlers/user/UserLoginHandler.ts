import { IHandler } from "../Interfaces"
import { EventTypes, IUserLoginRequest, IUserAuthenticationResponse } from "shared";
import bind from "bind-decorator";
import { IUserService } from "../../services/UserService";

export default class UserLoginHandler implements IHandler<IUserLoginRequest, IUserAuthenticationResponse> {
	readonly eventType: EventTypes = EventTypes.Login
	
	constructor(private readonly service: IUserService) {}

	@bind
	handle(req: IUserLoginRequest) {
		return this.service.handleLogin(req)
	}
}