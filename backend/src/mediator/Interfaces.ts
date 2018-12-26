import { EventType } from 'shared'

export type IClient = SocketIO.Socket

type Handler<Req, Res> = (request: Req) => Promise<Res> | Res

export interface IHandler<Req = object, Res = object> extends Iterable<EventType | Handler<Req, Res>> {
	[0]: EventType
	[1]: Handler<Req, Res>
}

export interface IMediator {
	use(...handlers: IHandler[]): void
	subscribe(client: IClient): void
	unsubscribe(client: IClient): boolean
	broadcast(eventType: EventType, data: object): void
	broadcastEvents(...eventTypes: EventType[]): void
	usePreRespond(...hooks: IPreRespondHook[]): void
	usePostRespond(...hooks: IPostRespondHook[]): void
	removePostRespond(hook: IPostRespondHook): boolean
	removePreRespond(hook: IPreRespondHook): boolean
}

interface IHook {
	eventTypes?: Set<EventType>
	exceptions?: Set<EventType>
}

export interface IPreRespondHook extends IHook {
	handle(req: object): Promise<object | void>
}

export interface IPostRespondHook extends IHook {
	handle(req: object, res: object): Promise<void>
}
