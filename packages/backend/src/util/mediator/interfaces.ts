import { EventType } from 'shared'
import { Newable } from '../types'
import { EventEmitter } from 'events'

export type Handler<Req = object, Res = object> = (request: Req) => Res | Promise<Res | void>

export type ConstructedHandler = (request: object, respond: (res: Error | object) => void) => void

type ClientPredicate = (client: IClient) => boolean

export enum MediatorEvent {
	Subscribe = 'Subscribe',
	Unsubscribe = 'Unsubscribe',
}

export interface IClient extends EventEmitter {
	nsp: {
		name: string,
	}
	handshake: {
		query: {
			[x: string]: any,
		},
	}
	join(room: string, callback?: () => void): void
	leave(room: string, callback?: () => void): void
}

export interface IRequestHandler<Req extends object, Res extends object> {
	eventType: EventType
	handler: Handler<Req, Res>
	requestType?: Newable<Req>
	responseType?: Newable<Res>
	broadcast?: boolean
}

export interface ISocketMediator extends EventEmitter {
	name: string
	clients: IClient[]
	use<Req extends object, Res extends object>(handler: IRequestHandler<Req, Res>): this
	subscribe(client: IClient): void
	unsubscribe(client: IClient): void
	dispose(): void
	pre(hook: IPreRespondHook): this
	post(hook: IPostRespondHook): this
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
