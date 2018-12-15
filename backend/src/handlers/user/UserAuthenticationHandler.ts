import { IHandler } from "../../util/mediator/Interfaces"
import { EventType, IUserAuthenticationResponse, IUserAuthenticationRequest } from "shared";
import { IUserService } from "../../services/UserService";
import { inject, injectable } from "inversify";
import { Services } from "../../dependencies/symbols";
import bind from "bind-decorator";

@injectable()
export default class UserAuthenticationHandler implements IHandler<IUserAuthenticationRequest, IUserAuthenticationResponse> {
	readonly eventType: EventType = EventType.Authentication

	constructor(@inject(Services.User) private readonly service: IUserService) {}

	@bind
	handle() {
		return this.service.handleAuthentication(arguments[0])
	}
}