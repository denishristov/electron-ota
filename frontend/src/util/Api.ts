import bind from "bind-decorator"
import { EventType, IRequest, IResponse, IUserLoginRequest } from 'shared'

export interface IApi {
	emit<Res extends IResponse = IResponse>(eventType: EventType, request?: object | undefined): Promise<Res>
	on<Res extends IResponse>(eventType: string, ack: (res: Res) => void): void
	preEmit<Req extends object, T>(ack: (data: T) => T & Req): void
}

export default class Api implements IApi {
	private readonly preEmitHooks: Function[] = []

	constructor(private socket: SocketIOClient.Socket) {}

	@bind
	preEmit<Req extends object, T>(ack: (data: T) => T & Req): void {
		this.preEmitHooks.push(ack)
	}

	emit<Res extends IResponse = IResponse>(eventType: EventType, request?: object): Promise<Res> {
		return new Promise((resolve, reject) => {
			this.socket.emit(eventType, this.attachData(request || {}), (data: Res) => {
				if (data.errorMessage) {
					reject(data)
				} else {
					resolve(data)
				}
			})
		})
	}

	@bind
	on<Res extends IResponse = IResponse>(eventType: string, ack: (res: Res) => void): void {
		this.socket.on(eventType, (res: Res) => {
			if (res.errorMessage) {
				throw new Error(res.errorMessage)
			} else {
				ack(res)
			}
		})
	}

	private attachData<Req extends object>(request: Req): Req & { authToken: string | null; } {
		return Object.assign(request, ...this.preEmitHooks.map(ack => ack(request)))
	}
}