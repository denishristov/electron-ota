import { EventType, IResponse } from 'shared'

export interface IApi {
	emit<Res extends IResponse = IResponse>(eventType: EventType, request?: object): Promise<Res>
	on<Res extends IResponse>(eventType: string, cb: (res: Res) => void): void
	usePreEmit(cb: Hook): void
}

type Hook = (req: object) => object | void

@DI.injectable()
export default class Api implements IApi {
	private readonly preEmitHooks: Hook[] = []

	constructor(
		@DI.inject(DI.Connection) private readonly connection: SocketIOClient.Socket,
	) {}

	@bind
	public usePreEmit(cb: Hook): void {
		this.preEmitHooks.push(cb)
	}

	public emit<Res extends IResponse = IResponse>(eventType: EventType, request?: object): Promise<Res> {
		return new Promise((resolve, reject) => {
			const timeout = setTimeout(() => reject({ eventType, request, message: 'timeout' }), 1000 * 10)
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
	public on<Res extends IResponse = IResponse>(eventType: string, cb: (res: Res) => void): void {
		this.connection.on(eventType, (res: Res) => {
			if (res && res.errorMessage) {
				throw new Error(res.errorMessage)
			} else {
				cb(res)
			}
		})
	}

	private attachData<Req extends object>(request: Req): Req & { authToken: string | null; } {
		return Object.assign(request, ...this.preEmitHooks.map((cb) => cb(request)).filter(Boolean))
	}
}
