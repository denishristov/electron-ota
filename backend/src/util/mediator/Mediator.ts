import { EventType, IResponse } from 'shared'
import {
	IClient,
	IClients,
	IEventHandler,
	IPreRespondHook,
	ISocketMediator,
	IPostRespondHook,
	IEventHandlers,
} from './interfaces'
import crypto from 'crypto'

export default class SocketMediator implements ISocketMediator {
	private readonly handlers: Map<string, IEventHandler> = new Map()
	private readonly preRespondHooks: Map<IPreRespondHook, IPreRespondHook> = new Map()
	private readonly postRespondHooks: Map<IPostRespondHook, IPostRespondHook> = new Map()
	private readonly broadcastableEvents: Set<EventType> = new Set()
	private readonly roomId = crypto.randomBytes(16).toString('base64')

	constructor(private readonly clients: IClients) {
		clients.on(EventType.Connection, this.subscribe)
	}

	public use(eventHandlers: IEventHandlers): void {
		const entries = Object.entries(eventHandlers) as IEventHandler[]

		for (const eventHandler of entries) {
			const [eventType] = eventHandler

			if (this.handlers.has(eventType)) {
				throw new Error(`Handler has already been added for ${eventType}`)
			}

			this.handlers.set(eventType, eventHandler)

			// for (const client of this.sockets) {
			// 	client.on(eventType, this.createEventHandler(client, eventHandler))
			// }
		}
	}

	@bind
	public subscribe(client: IClient): void {
		// tslint:disable-next-line:no-console
		console.log(client.handshake.query)

		client.join(this.roomId, () => {
			for (const [eventType, eventHandler] of this.handlers) {
				client.on(eventType, this.createEventHandler(client, eventHandler))
			}
		})

		client.on(EventType.Disconnect, () => this.unsubscribe(client))
	}

	@bind
	public unsubscribe(client: IClient) {
		return client.leave(this.roomId)
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

	public broadcast(
		eventType: EventType,
		data: object,
		predicate?: (client: IClient) => boolean,
		count?: number,
	): void {
		const iterations = count
			? Math.min(this.sockets.length, count)
			: this.sockets.length

		for (let i = 0; i < iterations; ++i) {
			const socket = this.sockets[i]

			if (predicate ? predicate(socket) : true) {
				socket.emit(eventType, data)
			}
		}
		// tslint:disable-next-line:no-console
		console.log(
			'----------------------------------\n',
			`${eventType}\n`,
			// '----------------------------------\n',
			' broadcast: ', data,
		)
	}

	public removePostRespond(hook: IPostRespondHook) {
		return this.postRespondHooks.delete(hook)
	}

	public removePreRespond(hook: IPreRespondHook) {
		return this.preRespondHooks.delete(hook)
	}

	private get room() {
		return this.clients.in(this.roomId)
	}

	private get sockets(): IClient[] {
		return Object.values(this.clients.sockets)
	}

	private async applyPreHooks(eventType: EventType, request: object): Promise<IResponse> {
		if (!this.preRespondHooks.size) {
			return request
		}

		let data = { ...request }

		for (const [hook] of this.preRespondHooks) {
			const { eventTypes, exceptions } = hook
			if (eventTypes && !eventTypes.has(eventType)) {
				continue
			}

			if (exceptions && exceptions.has(eventType)) {
				continue
			}

			data = await hook.handle(request)

			if (!data) {
				return null
			}
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

	private createEventHandler(client: IClient, [eventType, handle]: IEventHandler) {
		return async (request: object, respond: (res: object) => void) => {
			const data = await this.applyPreHooks(eventType, request)

			if (!data || data.errorMessage) {
				// tslint:disable-next-line:no-console
				console.log(
					'----------------------------------\n',
					`${eventType}\n`,
					// '----------------------------------\n',
					'request: ', request,
					// '----------------------------------\n',
					'hook: ', data,
				)

				respond({ errorMessage: data && data.errorMessage })
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
				respond(response)

				this.applyPostHooks(eventType, request, response)

				if (this.broadcastableEvents.has(eventType)) {
					// this.broadcast(eventType, response, )
					client.in(this.roomId).emit(eventType, response)
					// tslint:disable-next-line:no-console
					console.log(
						'----------------------------------\n',
						`${eventType}\n`,
						// '----------------------------------\n',
						' broadcast: ', response,
					)
				}
			}
		}
	}
}
