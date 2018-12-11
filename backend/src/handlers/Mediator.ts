import { IMediator, IHandler } from "./Interfaces"
import { IRequest, IResponse, IUserLoginResponse, IUserLoginRequest } from "shared";
import bind from "bind-decorator";
import { Socket } from "socket.io";

export default class Mediator implements IMediator {
	readonly handlers: Map<string, IHandler<any, any>[]> = new Map()

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
	private join(client: Socket) {
		client.join(this.clients.name, () => {
			console.log('joined', this.clients)
			
			this.handlers.forEach((handlers, eventType) => {
				handlers.forEach(handler => {
					client.on(eventType, async (data: any, ack: Function) => {
						console.log('req', data)
						const response = await handler.handle(data)
						console.log('res', response)
						
						if (response) {
							ack(response)
						}
					})
				})
			})
		})
	}
}