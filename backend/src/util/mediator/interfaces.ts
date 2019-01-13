import { EventType } from 'shared'

export type IClient = SocketIO.Socket
export type IClients = SocketIO.Namespace

type IHandler<Req = object, Res = object> = (request: Req) => Promise<Res> | Res

export interface IEventHandler<Req = object, Res = object> extends Iterable<EventType | IHandler<Req, Res>> {
	[0]: EventType
	[1]: IHandler<Req, Res>
}

export type IEventHandlers = {
	[key in EventType]?: IHandler
}

export interface ISocketMediator {
	use(eventHandlers: IEventHandlers): void
	subscribe(client: IClient): void
	unsubscribe(client: IClient): void
	broadcast(eventType: EventType, data: object, predicate?: (client: IClient) => boolean, count?: number): void
	broadcastEvents(...eventTypes: EventType[]): void
	usePreRespond(...hooks: IPreRespondHook[]): void
	usePostRespond(...hooks: IPostRespondHook[]): void
	removePostRespond(hook: IPostRespondHook): void
	removePreRespond(hook: IPreRespondHook): void
}

interface IHook {
	eventTypes?: Set<EventType>
	exceptions?: Set<EventType>
}

export interface IPreRespondHook extends IHook {
	handle(req: object): Promise<object | null>
}

export interface IPostRespondHook extends IHook {
	handle(req: object, res: object): Promise<void>
}
