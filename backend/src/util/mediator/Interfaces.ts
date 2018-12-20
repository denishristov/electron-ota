import { EventType } from 'shared'

type Listener = (request: object, ack: (res: object) => void) => Promise<void>
export interface IClient {
	on(event: string, listener: Listener): IClient
}

export interface IHandler<Req = object, Res = object> {
	eventType: EventType
	handle(request: Req): Promise<Res> | Res
}

export interface IMediator {
	addHandlers(...handlers: IHandler[]): void
	subscribe(client: IClient): void
	usePreRespond(...hooks: IHook[]): void
	usePostRespond(...hooks: IHook[]): void
}

export interface IHook {
	exceptions?: EventType[]
	handle: (eventType: EventType, data: object) => Promise<object | void>
}
