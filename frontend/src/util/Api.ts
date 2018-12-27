import bind from 'bind-decorator'
import { injectable } from 'inversify'
import { EventType, IResponse } from 'shared'
import { inject } from 'inversify'
import * as DI from '../dependencies/symbols'

export interface IApi {
	emit<Res extends IResponse = IResponse>(eventType: EventType, request?: object): Promise<Res>
	on<Res extends IResponse>(eventType: string, ack: (res: Res) => void): void
	preEmit(ack: Hook): void
}

type Hook = (req: object) => object

@injectable()
export default class Api implements IApi {
	private readonly preEmitHooks: Hook[] = []

	constructor(
		@inject(DI.Connection) private readonly connection: SocketIOClient.Socket,
	) {}

	@bind
	public preEmit(ack: Hook): void {
		this.preEmitHooks.push(ack)
	}

	public emit<Res extends IResponse = IResponse>(eventType: EventType, request?: object): Promise<Res> {
		return new Promise((resolve, reject) => {
			const timeout = setTimeout(() => reject({ eventType, request }), 1000 * 5)
			// console.log(this.preEmitHooks)
			this.connection.emit(eventType, this.attachData(request || {}), (data: Res) => {
				clearTimeout(timeout)
				if (data!.errorMessage) {
					reject(data)
				} else {
					resolve(data)
				}
			})
		})
	}

	@bind
	public on<Res extends IResponse = IResponse>(eventType: string, ack: (res: Res) => void): void {
		this.connection.on(eventType, (res: Res) => {
			if (res && res.errorMessage) {
				throw new Error(res.errorMessage)
			} else {
				ack(res)
			}
		})
	}

	private attachData<Req extends object>(request: Req): Req & { authToken: string | null; } {
		return Object.assign(request, ...this.preEmitHooks.map((ack) => ack(request)))
	}
}
