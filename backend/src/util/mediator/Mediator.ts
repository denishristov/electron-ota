import { EventType } from 'shared'
import {
	Client,
	Clients,
	IPreRespondHook,
	ISocketMediator,
	IPostRespondHook,
	ConstructedHandler,
	Newable,
	Handler,
} from './interfaces'
import chalk from 'chalk'
import { uuid } from '../util'
import { Validator } from 'tsdv-joi'

const colors = {
	request: chalk.bold.green,
	response: chalk.bold.blue,
	error: chalk.bold.red,
	eventType: chalk.bold.yellow,
	broadcast: chalk.bold.magenta,
}

export default class SocketMediator implements ISocketMediator {
	private static readonly validator = new Validator()

	private readonly handlers = new Map<string, ConstructedHandler>()

	private readonly preRespondHooks = new Map<IPreRespondHook, IPreRespondHook>()

	private readonly postRespondHooks = new Map<IPostRespondHook, IPostRespondHook>()

	private readonly broadcastableEvents = new Set<EventType>()

	private readonly roomId = uuid()

	constructor(private readonly clients: Clients) {
		clients.on(EventType.Connection, this.subscribe)
	}

	public get name() {
		return this.clients.name
	}

	public use<Req extends object, Res extends object>(
		eventType: EventType,
		handler: Handler<Req, Res>,
		requestType: Newable<Req>,
		responseType?: Newable<Res>,
	) {
		if (this.handlers.has(eventType)) {
			throw new Error(`Handler has already been added for ${eventType}`)
		}

		this.handlers.set(eventType, this.createEventHandler(eventType, handler, requestType, responseType))

		return this
	}

	@bind
	public subscribe(client: Client) {
		client.join(this.roomId, () => {
			for (const handler of this.handlers) {
				client.on(...handler)
			}
		})

		client.on(EventType.Disconnect, () => this.unsubscribe(client))
	}

	@bind
	public unsubscribe(client: Client) {
		return client.leave(this.roomId)
	}

	public usePreRespond(...hooks: IPreRespondHook[]) {
		for (const hook of hooks) {
			this.preRespondHooks.set(hook, hook)
		}

		return this
	}

	public usePostRespond(...hooks: IPostRespondHook[]) {
		for (const hook of hooks) {
			this.postRespondHooks.set(hook, hook)
		}

		return this
	}

	public broadcastEvents(...eventTypes: EventType[]) {
		for (const eventType of eventTypes) {
			this.broadcastableEvents.add(eventType)
		}

		return this
	}

	public broadcast(
		eventType: EventType,
		data: object,
		predicate?: (client: Client) => boolean,
		count?: number,
	): void {
		for (const socket of this.sockets.slice(0, count)) {
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

	private get sockets(): Client[] {
		return Object.values(this.clients.sockets)
	}

	private async applyPreHooks<T>(eventType: EventType, request: T): Promise<T> {
		if (!this.preRespondHooks.size) {
			return request
		}

		let data = request

		for (const [{ eventTypes, exceptions, handle }] of this.preRespondHooks) {
			if (
				(eventTypes && !eventTypes.has(eventType))
				|| (exceptions && exceptions.has(eventType))
			) {
				continue
			}

			data = await handle(eventType, request)
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

	private createEventHandler<Req extends object, Res>(
		eventType: EventType,
		handler: Handler<Req, Res>,
		requestType: Newable<Req>,
		responseType?: Newable<Res>,
	) {
		return async (request: Req, respond: (res: Res | Error | object) => void) => {
			let response = null

			try {
				await SocketMediator.validator.validateAsClass(request, requestType)
				const data = await this.applyPreHooks(eventType, request)

				response = await handler(data) || {}

				if (responseType) {
					await SocketMediator.validator.validateAsClass(response, responseType)
				}

				respond(response)

				this.logRequest(eventType, request, response)
			} catch (error) {
				this.logError(eventType, request, error)
				respond(error)
			}

			this.applyPostHooks(eventType, request, response)

			if (this.broadcastableEvents.has(eventType)) {
				this.broadcast(eventType, response)
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
