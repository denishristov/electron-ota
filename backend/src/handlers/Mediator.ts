import { IMediator, IHandler } from "./Interfaces"
import { IRequest, IResponse, IUserLoginResponse, IUserLoginRequest, EventTypes } from "shared";
import bind from "bind-decorator";
import { Socket } from "socket.io";

type Hook = (data: any) => Promise<any>
type OnHook = { hook: Hook, exceptions: EventTypes[], eventType: EventTypes }

export default class Mediator implements IMediator {
	readonly handlers: Map<EventTypes, IHandler[]> = new Map()
	readonly hooks: OnHook[] = []

	constructor(readonly clients: SocketIO.Namespace) {
		this.clients.on('connection', this.join)
	}

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
	private join(client: Socket) {
		client.join(this.clients.name, () => {
			client.on('disconnect', () => {
				client.leaveAll()
			})

			this.handlers.forEach((handlers, eventType) => {
				handlers.forEach(handler => {
					client.on(eventType, async (request: any, ack: Function) => {
						// console.log(eventType, ' before hook', request)
						const data = await this.hookRequest(eventType, request)

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
		})
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
}