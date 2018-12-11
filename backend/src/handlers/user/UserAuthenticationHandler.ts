import { IHandler } from "../Interfaces"
import { EventTypes, IUserAuthenticationResponse, IUserAuthenticationRequest } from "shared";
import bind from "bind-decorator";
import { IUserService } from "../../services/UserService";

export default class UserAuthenticationHandler implements IHandler<IUserAuthenticationRequest, IUserAuthenticationResponse> {
	readonly eventType: EventTypes = EventTypes.Authentication
	
	constructor(private readonly service: IUserService) {}

	@bind
	handle(req: IUserAuthenticationRequest) {
		return this.service.handleAuthentication(req)
	}
}