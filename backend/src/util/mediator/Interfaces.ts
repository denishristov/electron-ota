import { IRequest, IResponse, IUserLoginRequest, EventType } from "shared";

export interface IClient {
	on(event: EventType, listener: Function): IClient
	// emit
}

export interface IHandler<Req = any, Res = any> {
	eventType: EventType
	handle(request: Req): Promise<Res> | Res
}

export interface IMediator {
	addHandlers<Req extends IRequest | IUserLoginRequest, Res extends IResponse>(...handlers: IHandler<Req, Res>[]): void
	subscribe(client: IClient): void
	usePreRespond(...hooks: IHook[]): void 
	usePostRespond(...hooks: IHook[]): void 
}

export interface IHook {
	exceptions?: EventType[]
	handle:(eventType: EventType, data: any) => Promise<any>
}