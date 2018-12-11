import { IHandler } from "../Interfaces"
import { IRequest, ICreateApplicationRequest, ICreateApplicationResponse, IUserLoginRequest, IUserAuthenticationResponse } from "shared";
import { IApplicationService } from '../../services/ApplicationService'
import bind from "bind-decorator";
import { IUserService } from "../../services/UserService";

export default class UserLoginHandler implements IHandler<IUserLoginRequest, IUserAuthenticationResponse> {
	constructor(
		readonly eventType: string, 
		private readonly service: IUserService
	) {}

	@bind
	handle(req: IUserLoginRequest) {
		return this.service.handleLogin(req)
	}
}