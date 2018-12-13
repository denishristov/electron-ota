import { IMediator, IHandler, IHook, IClient } from "./Interfaces"
import { EventType } from "shared"

export default class Mediator implements IMediator {
	private readonly handlers: Map<EventType, IHandler[]> = new Map()
	private readonly preRespondHooks: IHook[] = []
	private readonly postRespondHooks: IHook[] = []

	addHandlers(...handlers: IHandler[]): void {
		for (const handler of handlers) {
			const { eventType } = handler
			
			if (this.handlers.has(eventType)) {
				this.handlers.get(eventType).push(handler)
			} else {
				this.handlers.set(eventType, [handler])
			}			
		}
	}

	subscribe(client: IClient): void {
		for (const [eventType, handlers] of this.handlers) {
			client.on(eventType, this.createEventHandler(handlers))
		}		
	}

	usePreRespond(...hooks: IHook[]): void {
		this.preRespondHooks.push(...hooks)
	}

	usePostRespond(...hooks: IHook[]): void {
		this.postRespondHooks.push(...hooks)
	}

	private async applyHooks(hooks: IHook[], eventType: EventType, request: object): Promise<object | null> {
		if (!hooks.length) {
			return request
		}
		
		const data = { ...request }

		for (const hook of hooks) {
			if (hook.exceptions && hook.exceptions.some(excludedType => excludedType === eventType)) {
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

	private createEventHandler(handlers: IHandler[]) {
		const { eventType } = handlers[0]

		return async (request: any, ack: Function) => {
			const data = await this.applyHooks(this.preRespondHooks, eventType, request)

			if (!data) {
				return
			}

			for (const handler of handlers) {
				const response = await handler.handle(data)
				
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
					this.applyHooks(this.postRespondHooks, handler.eventType, response)
				}
			}
		}
	}
}
