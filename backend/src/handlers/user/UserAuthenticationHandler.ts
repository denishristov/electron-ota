import { IHandler } from "../Interfaces"
import { EventTypes, IUserAuthenticationResponse, IUserAuthenticationRequest } from "shared";
import bind from "bind-decorator";
import { IUserService } from "../../services/UserService";

export default class UserAuthenticationHandler implements IHandler<IUserAuthenticationRequest, IUserAuthenticationResponse> {
	constructor(
		readonly eventType: EventTypes, 
		private readonly service: IUserService
	) {}

	@bind
	handle(req: IUserAuthenticationRequest) {
		return this.service.handleAuthentication(req)
	}
}