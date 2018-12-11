import { IMediator, IHandler, ISocketConnection } from "./Interfaces"
import { IRequest, IResponse, IUserLoginResponse, IUserLoginRequest, EventTypes, DefaultEventTypes } from "shared";
import bind from "bind-decorator";
import { Socket } from "socket.io";

type Hook = (data: any) => Promise<any>
type OnHook = { hook: Hook, exceptions: EventTypes[], eventType: EventTypes }

abstract class AbstractMediator implements IMediator {
	readonly handlers: Map<EventTypes, IHandler[]> = new Map()
	readonly hooks: OnHook[] = []

	constructor() {}

	@bind
	registerHandler<Req extends IRequest | IUserLoginRequest, Res extends IResponse>(...handlers: IHandler<Req, Res>[]): void {
		for (const handler of handlers) {
			const { eventType } = handler

			if (this.handlers.has(eventType)) {
				this.handlers.get(eventType).push(handler)
			} else {
				this.handlers.set(eventType, [handler])
			}			
		}
	}

	@bind
	registerOnHook(hook: OnHook): void {
		this.hooks.push(hook)
	}

	@bind
	async hookRequest(eventType: EventTypes, request: object): Promise<object | null> {
		if (!this.hooks.length) {
			return
		}
		
		const data = { ...request }

		for (const hook of this.hooks) {
			if (hook.exceptions.some(excludedType => excludedType === eventType)) {
				continue
			}

			const hookedData = await hook.hook(data)

			if (!hookedData) {
				return null
			}

			Object.assign(data, hookedData)
		}
		
		return data
	}

	@bind
	attachListeners(client: Socket) {
		this.handlers.forEach((handlers, eventType) => {
			handlers.forEach(handler => {
				client.on(eventType, async (request: any, ack: Function) => {
					// console.log(ack)
					const data = await this.hookRequest(eventType, request)

					console.log(request, data)

					if (!data) {
						return
					}

					const response = await handler.handle(data)
					
					console.log(eventType, 'request', data, 'response', response)
					
					if (response) {
						ack(response)
					}
				})
			})
		})
	}
}

export class Mediator extends AbstractMediator {
	// constructor(readonly client: Socket) {
	// 	super(client)
	// }
	// attach()
}

export class NamespaceMediator extends AbstractMediator {
	constructor(readonly clients: SocketIO.Namespace) {
		super()

		this.clients.on(DefaultEventTypes.Connect, this.join)
	}

	@bind
	join(client: Socket) {
		client.join(this.clients.name, () => {
			console.log('join namespace')

			client.on(DefaultEventTypes.Disconnect, () => {
				client.leaveAll()
			})

			this.attachListeners(client)
		})
	}
}
