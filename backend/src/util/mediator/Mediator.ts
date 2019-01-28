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
import chalk from 'chalk'
import { uuid } from '../util'

const colors = {
	request: chalk.bold.green,
	response: chalk.bold.blue,
	error: chalk.bold.red,
	eventType: chalk.bold.yellow,
	broadcast: chalk.bold.magenta,
}

export default class SocketMediator implements ISocketMediator {
	private readonly handlers = new Map<string, IEventHandler>()
	private readonly preRespondHooks = new Map<IPreRespondHook, IPreRespondHook>()
	private readonly postRespondHooks = new Map<IPostRespondHook, IPostRespondHook>()
	private readonly broadcastableEvents = new Set<EventType>()
	private readonly roomId = uuid()

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

		this.logBroadcast(eventType, data)
	}

	public removePostRespond(hook: IPostRespondHook) {
		return this.postRespondHooks.delete(hook)
	}

	public removePreRespond(hook: IPreRespondHook) {
		return this.preRespondHooks.delete(hook)
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

			data = await hook.handle(eventType, request)

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

			postHook.handle(eventType, req, res)
		}
	}

	private createEventHandler(client: IClient, [eventType, handle]: IEventHandler) {
		return async (request: object, respond: (res: object) => void) => {
			let response = null

			try {
				const data = await this.applyPreHooks(eventType, request)

				if (!data || data.errorMessage) {
					throw new Error(data.errorMessage)
				}

				response = await handle(data) || {}

				respond(response)

				this.logRequest(eventType, request, response)
			} catch (error) {
				this.logError(eventType, request, error)
				respond({ errorMessage: error.errorMessage })
			}

			this.applyPostHooks(eventType, request, response)

			if (this.broadcastableEvents.has(eventType)) {
				this.logBroadcast(eventType, response)
				client.in(this.roomId).emit(eventType, response)
			}
		}
	}

	// tslint:disable:no-console
	private logBroadcast(eventType: string, data: object) {
		console.log(colors.eventType(eventType))
		console.log(colors.broadcast('Broadcast: '), data)
		console.log('----------------------------------')
	}

	private logRequest(eventType: string, request: object, response: object) {
		console.log(colors.eventType(eventType))
		console.log(colors.request('Request: '), request)
		console.log(colors.response('Response: '), response)
		console.log('----------------------------------')
	}

	private logError(eventType: string, request: object, error: Error) {
		console.log(colors.eventType(eventType))
		console.log(colors.request('Request: '), request)
		console.log(colors.error('Error: '), error)
		console.log('----------------------------------')
	}
}
