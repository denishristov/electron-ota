import { IHandler } from "../../util/mediator/Interfaces"
import { EventType, IUserAuthenticationResponse, IUserAuthenticationRequest } from "shared";
import { IUserService } from "../../services/UserService";
import { inject } from "inversify";
import { SERVICES } from "../../dependencies/symbols";
import bind from "bind-decorator";

export default class UserAuthenticationHandler implements IHandler<IUserAuthenticationRequest, IUserAuthenticationResponse> {
	@inject(SERVICES.USER)
	private readonly service: IUserService

	readonly eventType: EventType = EventType.Authentication

	@bind
	handle() {
		return this.service.handleAuthentication(arguments[0])
	}
}