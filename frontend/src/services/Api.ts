import { EventType } from 'shared'
import { isError, filterValues } from '../util/functions'
import { Newable, Empty } from '../util/types'
import { terminalColors } from '../util/constants/styles'

interface IFetchArguments<Req extends object, Res extends object> {
	eventType: EventType
	requestType?: Req extends void ? void : Newable<Req>
	responseType?: Newable<Res>
	request?: Req
}
export interface IApi {
	fetch<Req extends object, Res extends object>(arg: IFetchArguments<Req, Res>): Promise<Res>
	on<Res extends object>(eventType: string, cb: (res: Res) => void): this
	pre(cb: PreHook): this
}

type PreHook = (req: object) => Promise<object> | object

@DI.injectable()
export default class Api implements IApi {
	private readonly preHooks: PreHook[] = []

	constructor(
		@DI.inject(DI.Connection)
		private readonly connection: SocketIOClient.Socket,
	) {}

	@bind
	public pre(cb: PreHook) {
		this.preHooks.push(cb)

		return this
	}

	public fetch<Req extends object, Res extends object>({
		eventType,
		requestType,
		request,
		responseType,
	}: IFetchArguments<Req, Res>): Promise<Res> {
		return new Promise(async (resolve, reject) => {
			let _request = {}

			try {
				_request = Object.assign(new (requestType || Empty)(), filterValues(request || {}))
				_request = await this.applyPreHooks(_request)

				const timeout = setTimeout(() => reject({ eventType, request, message: 'timeout' }), 1000 * 10)

				this.connection.emit(eventType, _request, (data: Res) => {
					const response = responseType ? Object.assign(new (responseType)(), data) : data

					clearTimeout(timeout)

					if (isError(response)) {
						this.logError(eventType, _request || {}, response)
						reject(response)
					} else {
						this.logRequest(eventType, _request || {}, response)
						resolve(response)
					}
				})
			} catch (error) {
				this.logError(eventType, _request, error)
				reject(error)
				return
			}
		})
	}

	@bind
	public on<Res extends object>(eventType: string, cb: (res: Res) => void): this {
		this.connection.on(eventType, (data: Res) => {
			this.logUpdate(eventType, data)
			cb(data)
		})

		return this
	}

	private async applyPreHooks(request: object) {
		let data: object = request

		for (const hook of this.preHooks) {
			data = await hook(data)
		}

		return data
	}

	// tslint:disable:no-console
	private logUpdate(eventType: string, data: object) {
		console.log(terminalColors.eventType(eventType))
		console.log(terminalColors.update('Update: '), data)
		console.log()
	}

	private logRequest(eventType: string, request: object, response: object) {
		console.log(terminalColors.eventType(eventType))
		console.log(terminalColors.request('Request: '), request)
		console.log(terminalColors.response('Response: '), response)
		console.log()
	}

	private logError(eventType: string, request: object, error: object) {
		console.log(terminalColors.eventType(eventType))
		console.log(terminalColors.request('Request: '), request)
		console.log(terminalColors.error('Error: '), error)
		console.log()
	}
}
