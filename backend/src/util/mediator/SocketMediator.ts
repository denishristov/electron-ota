import { EventType } from 'shared'
import {
	IPreRespondHook,
	ISocketMediator,
	IPostRespondHook,
	ConstructedHandler,
	IClient,
	MediatorEvent,
} from './interfaces'
import { uuid } from '../functions'
import { IRequestHandler } from './interfaces'
import { Empty } from '../types'
import { colors } from '../constants'
import { EventEmitter } from 'events'

export default class SocketMediator extends EventEmitter implements ISocketMediator {
	private readonly requestHandlers = new Map<string, ConstructedHandler>()

	private readonly preRespondHooks: IPreRespondHook[] = []

	private readonly postRespondHooks: IPostRespondHook[] = []

	private readonly roomId = uuid()

	constructor(private readonly namespace: SocketIO.Namespace) {
		super()

		namespace.on(EventType.Connection, this.subscribe)
		namespace.on(EventType.Connection, (client) => this.emit(MediatorEvent.Subscribe, client))
	}

	public get name() {
		return this.namespace.name
	}

	public get clients(): IClient[] {
		return Object.values(this.namespace.sockets)
	}

	public use<Req extends object, Res extends object>(requestHandler: IRequestHandler<Req, Res>) {
		if (this.requestHandlers.has(requestHandler.eventType)) {
			throw new Error(`Handler has already been added for ${requestHandler.eventType}`)
		}

		this.requestHandlers.set(requestHandler.eventType, this.constructEventHandler(requestHandler))

		return this
	}

	@bind
	public subscribe(client: IClient) {
		client.join(this.roomId, () => {
			for (const handler of this.requestHandlers) {
				client.on(...handler)
			}
		})

		client.on(EventType.Disconnect, () => this.unsubscribe(client))
	}

	@bind
	public unsubscribe(client: IClient) {
		this.emit(MediatorEvent.Unsubscribe, client)
		return client.leave(this.roomId)
	}

	public pre(hook: IPreRespondHook) {
		this.preRespondHooks.push(hook)

		return this
	}

	public post(hook: IPostRespondHook) {
		this.postRespondHooks.push(hook)

		return this
	}

	public broadcast(
		eventType: EventType,
		data: object,
		predicate?: (client: IClient) => boolean,
		count?: number,
	): void {
		for (const socket of this.clients.slice(0, count)) {
			if (predicate ? predicate(socket) : true) {
				socket.emit(eventType, data)
			}
		}

		this.logBroadcast(eventType, data)
	}

	private async applyPreHooks<T extends object>(eventType: EventType, request: T): Promise<T> {
		if (!this.preRespondHooks.length) {
			return request
		}

		let data = request

		for (const { eventTypes, exceptions, handle } of this.preRespondHooks) {
			if (
				(eventTypes && !eventTypes.has(eventType))
				|| (exceptions && exceptions.has(eventType))
			) {
				continue
			}

			data = await handle(eventType, data)
		}

		return data
	}

	private applyPostHooks(eventType: EventType, req: object, res: object): void {
		for (const { eventTypes, exceptions, handle } of this.postRespondHooks) {
			if (
				(eventTypes && !eventTypes.has(eventType))
				|| (exceptions && exceptions.has(eventType))
			) {
				continue
			}

			handle(eventType, req, res)
		}
	}

	private constructEventHandler<Req extends object, Res extends object>({
		eventType,
		handler,
		requestType,
		responseType,
		broadcast,
	}: IRequestHandler<Req, Res>) {
		return async (request: Req, respond: (res: object) => void) => {
			let response = null

			try {
				const data = await this.applyPreHooks(eventType, Object.assign(new (requestType || Empty)(), request))

				const result = await handler(data)

				response = Object.assign(new (responseType || Empty)(), result || {})

				respond(response)

				this.logRequest(eventType, request, response)
			} catch (error) {
				this.logError(eventType, request, error)
				respond(error)
			}

			if (response) {
				this.applyPostHooks(eventType, request, response)

				if (broadcast) {
					this.broadcast(eventType, response)
				}
			}
		}
	}

	// tslint:disable:no-console
	private logBroadcast(eventType: string, data: object) {
		console.log(colors.eventType(eventType))
		console.log(colors.broadcast('Broadcast: '), data)
		console.log()
	}

	private logRequest(eventType: string, request: object, response: object) {
		console.log(colors.eventType(eventType))
		console.log(colors.request('Request: '), request)
		console.log(colors.response('Response: '), response)
		console.log()
	}

	private logError(eventType: string, request: object, error: Error) {
		console.log(colors.eventType(eventType))
		console.log(colors.request('Request: '), request)
		console.log(colors.error('Error: '), error)
		console.log()
	}
}
