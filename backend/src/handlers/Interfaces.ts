import { IRequest, IResponse, IUserLoginRequest, EventTypes } from "shared";
import { join } from "bluebird";
import { Socket } from "socket.io";

export interface ISocketConnection {
	on(event: "connection", listener: (socket: Socket) => void): ISocketConnection
	// emit
}

export interface IHandler<Req extends IRequest | IUserLoginRequest = any, Res extends IResponse = any> {
	eventType: EventTypes
	handle(request: Req): Promise<Res>
}

export interface IMediator {
	handlers: Map<EventTypes, IHandler<any, any>[]>
	// clients: ISocketConnection
	registerHandler<Req extends IRequest | IUserLoginRequest, Res extends IResponse>(...handlers: IHandler<Req, Res>[]): void
	// join(client: Socket): void
}