import { IHandler } from "../Interfaces"
import { EventTypes, IUserLoginRequest, IUserAuthenticationResponse } from "shared";
import bind from "bind-decorator";
import { IUserService } from "../../services/UserService";

export default class UserLoginHandler implements IHandler<IUserLoginRequest, IUserAuthenticationResponse> {
	constructor(
		readonly eventType: EventTypes, 
		private readonly service: IUserService
	) {}

	@bind
	handle(req: IUserLoginRequest) {
		return this.service.handleLogin(req)
	}
}