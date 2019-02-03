import { EventType } from 'shared'

export type Client = SocketIO.Socket
export type Clients = SocketIO.Namespace

export type Handler<Req = object, Res = object> = (request: Req) => Promise<Res> | Promise<void>

export type Newable<T> = new() => T

export type ConstructedHandler = (request: object, respond: (res: Error | object) => void) => void

// export interface IEventHandler<Req extends object, Res extends object> extends Iterable<
// 	EventType |
// 	Handler<Req, Res> |
// 	Clazz<Req> |
// 	Clazz<Res>
// > {
// 	[0]: EventType
// 	[1]: Handler<Req, Res>
// 	[2]: Clazz<Req>
// 	[3]: Clazz<Res>
// }

export interface ISocketMediator {
	name: string
	use<Req extends object, Res extends object>(
		eventType: EventType,
		handler: Handler<Req, Res>,
		requestType: Newable<Req>,
		responseType?: Newable<Res>,
	): this
	subscribe(client: Client): void
	unsubscribe(client: Client): void
	broadcast(eventType: EventType, data: object, predicate?: (client: Client) => boolean, count?: number): void
	broadcastEvents(...eventTypes: EventType[]): this
	usePreRespond(...hooks: IPreRespondHook[]): this
	usePostRespond(...hooks: IPostRespondHook[]): this
	removePostRespond(hook: IPostRespondHook): void
	removePreRespond(hook: IPreRespondHook): void
}

interface IHook {
	eventTypes?: Set<EventType>
	exceptions?: Set<EventType>
}

export interface IPreRespondHook extends IHook {
	handle(eventType: EventType, req: any): Promise<any>
}

export interface IPostRespondHook extends IHook {
	handle(eventType: EventType, req: object, res: object): Promise<void>
}
