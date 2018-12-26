import { EventType } from 'shared'
import { IClient, IHandler, IPreRespondHook, IMediator, IPostRespondHook } from './Interfaces'

export default class Mediator implements IMediator {
	private readonly clients: Map<string, IClient> = new Map()
	private readonly handlers: Map<EventType, IHandler> = new Map()
	private readonly preRespondHooks: Map<IPreRespondHook, IPreRespondHook> = new Map()
	private readonly postRespondHooks: Map<IPostRespondHook, IPostRespondHook> = new Map()
	private readonly broadcastableEvents: Set<EventType> = new Set()

	public use(...handlers: IHandler[]): void {
		for (const handler of handlers) {
			const [eventType] = handler

			this.handlers.set(eventType, handler)

			for (const [_, client] of this.clients) {
				client.on(eventType, this.createEventHandler(handler))
			}
		}
	}

	public subscribe(client: IClient): void {
		this.clients.set(client.id, client)

		for (const [eventType, handler] of this.handlers) {
			client.on(eventType, this.createEventHandler(handler))
		}
	}

	public unsubscribe(client: IClient): boolean {
		return this.clients.delete(client.id)
	}

	public usePreRespond(...hooks: IPreRespondHook[]): void {
		for (const hook of hooks) {
			this.preRespondHooks.set(hook, hook)
		}
	}

	public usePostRespond(...hooks: IPostRespondHook[]): void {
		for (const hook of hooks) {
			this.postRespondHooks.set(hook, hook)
		}
	}

	public broadcastEvents(...eventTypes: EventType[]) {
		for (const eventType of eventTypes) {
			this.broadcastableEvents.add(eventType)
		}
	}

	public broadcast(eventType: EventType, data: object): void {
		for (const [_, client] of this.clients) {
			client.emit(eventType, data)
		}
	}

	public removePostRespond(hook: IPostRespondHook) {
		return this.postRespondHooks.delete(hook)
	}

	public removePreRespond(hook: IPreRespondHook) {
		return this.preRespondHooks.delete(hook)
	}

	private async applyPreHooks(eventType: EventType, request: object): Promise<object | null> {
		if (!this.preRespondHooks.size) {
			return request
		}

		const data = { ...request }

		for (const [hook] of this.preRespondHooks) {
			const { eventTypes, exceptions } = hook
			if (eventTypes && !eventTypes.has(eventType)) {
				continue
			}

			if (exceptions && exceptions.has(eventType)) {
				continue
			}

			const hookedData = await hook.handle(request)

			if (!hookedData) {
				return null
			}

			Object.assign(data, hookedData)
		}

		return data
	}

	private applyPostHooks(eventType: EventType, req: object, res: object): void {
		for (const [postHook] of this.postRespondHooks) {
			const { eventTypes, exceptions } = postHook

			if (eventTypes && !eventTypes.has(eventType)) {
				continue
			}

			if (exceptions && exceptions.has(eventType)) {
				continue
			}

			postHook.handle(req, res)
		}
	}

	private createEventHandler([eventType, handle]: IHandler) {
		return async (request: object, ack: (res: object) => void) => {
			const data = await this.applyPreHooks(eventType, request)

			if (!data) {
				// tslint:disable-next-line:no-console
				console.log('whops hook returned falsy')
				return
			}

			const response = await handle(data)

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

				this.applyPostHooks(eventType, request, response)

				if (this.broadcastableEvents.has(eventType)) {
					this.broadcast(eventType, response)
				}
			}
		}
	}
}
