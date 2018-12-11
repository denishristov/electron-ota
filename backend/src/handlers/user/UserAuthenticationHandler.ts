import { IHandler } from "../Interfaces"
import { IRequest, ICreateApplicationRequest, ICreateApplicationResponse, IUserLoginRequest, IUserAuthenticationResponse, IUserAuthenticationRequest } from "shared";
import { IApplicationService } from '../../services/ApplicationService'
import bind from "bind-decorator";
import { IUserService } from "../../services/UserService";

export default class UserAuthenticationHandler implements IHandler<IUserAuthenticationRequest, IUserAuthenticationResponse> {
	constructor(
		readonly eventType: string, 
		private readonly service: IUserService
	) {}

	@bind
	handle(req: IUserAuthenticationRequest) {
		return this.service.handleAuthentication(req)
	}
}