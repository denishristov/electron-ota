import { IHandler, IMediator } from "../util/mediator/Interfaces"
import { EventType } from "shared";
import Mediator from '../util/mediator/Mediator'
import UserAuthenticationHandler from './user/UserAuthenticationHandler'
import UserLoginHandler from "./user/UserLoginHandler";
import GetAppsHandler from "./apps/GetAppsHandler";
import { IUserService } from "../services/UserService";
import { IAppService } from "../services/AppService";


export default class NewAdminConnectionHandler implements IHandler<SocketIO.Socket> {
	readonly eventType: EventType = EventType.Connection
	
	constructor(
		private readonly userMediator: IMediator
	) {}

	handle(client: SocketIO.Socket) {
		this.userMediator.subscribe(client)
	}
}