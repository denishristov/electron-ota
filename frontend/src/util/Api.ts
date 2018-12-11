import bind from "bind-decorator"
import { EventTypes } from 'shared'

export interface IApi {
	emit<Req extends object, Res extends object>(eventType: string, request: Req): Promise<Res>
	on<Res extends object>(eventType: string, ack: (res: Res) => void): void
	preEmit<Req extends object, T>(ack: (data: T) => T & Req): void
}

export default class Api {
	private readonly preEmitHooks: Function[] = []

	constructor(private socket: SocketIOClient.Socket) {}

	@bind
	preEmit<Req extends object, T>(ack: (data: T) => T & Req): void {
		this.preEmitHooks.push(ack)
	}

	@bind
	emit<Req extends object, Res extends object = {}>(eventType: string, request: Req): Promise<Res> {
		return new Promise((resolve) => {
			this.socket.emit(eventType, this.attachData(request), resolve)
		})
	}

	@bind
	on<Res extends object>(eventType: string, ack: (res: Res) => void): void {
		this.socket.on(eventType, ack)
	}

	private attachData<Req extends object>(request: Req): Req & { authToken: string | null; } {
		return Object.assign(request, ...this.preEmitHooks.map(ack => ack(request)))
	}
}