import { EventType } from 'shared'

export type IClient = SocketIO.Socket
type IHandler<Req = object, Res = object> = (request: Req) => Promise<Res> | Res

export interface IEventHandler<Req = object, Res = object> extends Iterable<EventType | IHandler<Req, Res>> {
	[0]: EventType
	[1]: IHandler<Req, Res>
}

export interface IMediator {
	use(...handlers: IEventHandler[]): void
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
