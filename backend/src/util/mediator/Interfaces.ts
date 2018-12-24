import { EventType } from 'shared'

type Listener = (request: object, ack: (res: object) => void) => Promise<void>
export interface IClient {
	on(event: string, listener: Listener): IClient
	emit(event: string, data: object): boolean
}

export interface IHandler<Req = object, Res = object> {
	eventType: EventType
	handle(request: Req): Promise<Res> | Res
}

export interface IMediator {
	addHandlers(...handlers: IHandler[]): void
	subscribe(client: IClient): void
	emit(eventType: EventType, data: object): boolean
	usePreRespond(...hooks: IPreRespondHook[]): void
	usePostRespond(...hooks: IPostRespondHook[]): void
}

interface IHook {
	eventTypes?: EventType[]
	exceptions?: EventType[]
}

export interface IPreRespondHook extends IHook {
	handle(eventType: EventType, req: object): Promise<object | void>
}

export interface IPostRespondHook extends IHook {
	handle(eventType: EventType, req: object, res: object): Promise<void>
}
