import bind from "bind-decorator"
import { EventTypes, IRequest, IResponse, IUserLoginRequest } from 'shared'
import { rejects } from "assert";

export interface IApi {
	emit<Req extends IRequest | IUserLoginRequest, Res extends IResponse>(eventType: string, request: Req): Promise<Res>
	on<Res extends IResponse>(eventType: string, ack: (res: Res) => void): void
	preEmit<Req extends object, T>(ack: (data: T) => T & Req): void
}

export default class Api implements IApi {
	private readonly preEmitHooks: Function[] = []

	constructor(private socket: SocketIOClient.Socket) {
		socket.on('connect', console.log)
	}

	@bind
	preEmit<Req extends object, T>(ack: (data: T) => T & Req): void {
		this.preEmitHooks.push(ack)
	}

	@bind
	emit<Req extends IRequest | IUserLoginRequest, Res extends IResponse = {}>(eventType: string, request: Req): Promise<Res> {
		return new Promise((resolve, reject) => {
			this.socket.emit(eventType, this.attachData(request), (data: Res) => {
				if (data.errorMessage) {
					reject(data)
				} else {
					resolve(data)
				}
			})
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