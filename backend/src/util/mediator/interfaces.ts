import { EventType } from 'shared'
import { Newable } from '../types'

export type Client = SocketIO.Socket
export type Clients = SocketIO.Namespace

export type Handler<Req = object, Res = object> = (request: Req) => Promise<Res | void>

export type ConstructedHandler = (request: object, respond: (res: Error | object) => void) => void

type ClientPredicate = (client: Client) => boolean
export interface IRequestHandler<Req extends object, Res extends object> {
	eventType: EventType
	handler: Handler<Req, Res>
	requestType?: Newable<Req>
	responseType?: Newable<Res>
	broadcast?: boolean
}
export interface ISocketMediator {
	name: string
	use<Req extends object, Res extends object>(handler: IRequestHandler<Req, Res>): this
	subscribe(client: Client): void
	unsubscribe(client: Client): void
	pre(hook: IPreRespondHook): this
	post(hook: IPostRespondHook): this
	// removePost(hook: IPostRespondHook): boolean
	// removePre(hook: IPreRespondHook): boolean
	broadcast(eventType: EventType, data: object, predicate?: ClientPredicate, count?: number): void
}

interface IHook {
	eventTypes?: Set<EventType>
	exceptions?: Set<EventType>
}

export interface IPreRespondHook extends IHook {
	handle(eventType: EventType, req: object): Promise<any>
}

export interface IPostRespondHook extends IHook {
	handle(eventType: EventType, req: object, res: object): Promise<void>
}
