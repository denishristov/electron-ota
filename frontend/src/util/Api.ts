import { EventType } from 'shared'
import chalk from 'chalk'

export interface IApi {
	emit<Res extends object>(eventType: EventType, request?: object): Promise<Res>
	on<Res extends object>(eventType: string, cb: (res: Res) => void): this
	usePreEmit(cb: Hook): void
}

type Hook = (req: object) => object | void

const colors = {
	request: chalk.bold.green,
	response: chalk.bold.blue,
	error: chalk.bold.red,
	eventType: chalk.bold.yellow,
	update: chalk.bold.magenta,
}

@DI.injectable()
export default class Api implements IApi {
	private readonly preEmitHooks: Hook[] = []

	constructor(
		@DI.inject(DI.Connection)
		private readonly connection: SocketIOClient.Socket,
	) {}

	@bind
	public usePreEmit(cb: Hook): void {
		this.preEmitHooks.push(cb)
	}

	public emit<Res extends object>(eventType: EventType, request: object = {}): Promise<Res> {
		return new Promise((resolve, reject) => {
			const timeout = setTimeout(() => reject({ eventType, request, message: 'timeout' }), 1000 * 10)
			// console.log(this.preEmitHooks)
			this.connection.emit(eventType, this.attachData(request || {}), (data: Res) => {
				clearTimeout(timeout)

				if (Object.keys(data).some((key) => key === 'errorMessage' || key === 'stack')) {
					this.logError(eventType, request || {}, data)
					reject(data)
				} else {
					this.logRequest(eventType, request || {}, data)
					resolve(data)
				}
			})
		})
	}

	@bind
	public on<Res extends object>(eventType: string, cb: (res: Res) => void): this {
		this.connection.on(eventType, (res: Res) => {
			this.logUpdate(eventType, res)
			cb(res)
		})

		return this
	}

	private attachData(request: object) {
		return Object.assign(request, ...this.preEmitHooks.map((cb) => cb(request)).filter(Boolean))
	}

	// tslint:disable:no-console
	private logUpdate(eventType: string, data: object) {
		console.log(colors.eventType(eventType))
		console.log(colors.update('Update: '), data)
		console.log('----------------------------------')
	}

	private logRequest(eventType: string, request: object, response: object) {
		console.log(colors.eventType(eventType))
		console.log(colors.request('Request: '), request)
		console.log(colors.response('Response: '), response)
		console.log('----------------------------------')
	}

	private logError(eventType: string, request: object, error: object) {
		console.log(colors.eventType(eventType))
		console.log(colors.request('Request: '), request)
		console.log(colors.error('Error: '), error)
		console.log('----------------------------------')
	}
}
