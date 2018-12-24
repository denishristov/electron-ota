import { EventType } from 'shared'
import { IClient, IHandler, IPreRespondHook, IMediator, IPostRespondHook } from './Interfaces'

export default class Mediator implements IMediator {
	private readonly handlers: Map<EventType, IHandler[]> = new Map()
	private readonly preRespondHooks: IPreRespondHook[] = []
	private readonly postRespondHooks: IPostRespondHook[] = []

	constructor(private readonly clients: IClient) {}

	public addHandlers(...handlers: IHandler[]): void {
		for (const handler of handlers) {
			const { eventType } = handler

			if (this.handlers.has(eventType)) {
				this.handlers.get(eventType).push(handler)
			} else {
				this.handlers.set(eventType, [handler])
			}
		}
	}

	public subscribe(client: IClient): void {
		for (const [eventType, handlers] of this.handlers) {
			client.on(eventType, this.createEventHandler(handlers))
		}
	}

	public usePreRespond(...hooks: IPreRespondHook[]): void {
		this.preRespondHooks.push(...hooks)
	}

	public usePostRespond(...hooks: IPostRespondHook[]): void {
		this.postRespondHooks.push(...hooks)
	}

	public emit(eventType: EventType, data: object): boolean {
		return this.clients.emit(eventType, data)
	}

	private async applyPreHooks(eventType: EventType, request: object): Promise<object | null> {
		if (!this.preRespondHooks.length) {
			return request
		}

		const data = { ...request }

		for (const hook of this.preRespondHooks) {
			const { eventTypes, exceptions } = hook
			if (eventTypes && !eventTypes.some((includedType) => includedType === includedType)) {
				continue
			}

			if (exceptions && exceptions.some((excludedType) => excludedType === eventType)) {
				continue
			}

			const hookedData = await hook.handle(eventType, request)

			if (!hookedData) {
				return null
			}

			Object.assign(data, hookedData)
		}

		return data
	}

	private applyPostHooks(eventType: EventType, req: object, res: object): void {
		for (const postHook of this.postRespondHooks) {
			postHook.handle(eventType, req, res)
		}
	}

	private createEventHandler(handlers: IHandler[]) {
		const { eventType } = handlers[0]

		return async (request: object, ack: (res: object) => void) => {
			const data = await this.applyPreHooks(eventType, request)

			if (!data) {
				// tslint:disable-next-line:no-console
				console.log('whops hook returned falsy')
				return
			}

			for (const handler of handlers) {
				const response = await handler.handle(data)

				// tslint:disable-next-line:no-console
				console.log(
					'----------------------------------\n',
					`${eventType}\n`,
					// '----------------------------------\n',
					'request: ', request,
					// '----------------------------------\n',
					'response: ', response,
				)

				if (response) {
					ack(response)
					this.applyPostHooks(handler.eventType, request, response)
				}
			}
		}
	}
}
