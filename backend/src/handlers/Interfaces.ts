import { IRequest, IResponse, IUserLoginRequest } from "shared";
import { join } from "bluebird";
import { Socket } from "socket.io";

export interface IHandler<Req extends IRequest | IUserLoginRequest, Res extends IResponse> {
	eventType: string
	handle(request: Req): Promise<Res>
}

export interface IMediator {
	handlers: Map<string, IHandler<any, any>[]>
	clients: SocketIO.Namespace
	registerHandler<Req extends IRequest | IUserLoginRequest, Res extends IResponse>(...handlers: IHandler<Req, Res>[]): void
	// join(client: Socket): void
}