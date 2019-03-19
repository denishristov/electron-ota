import { EventType, AdminLoginRequest, AdminLoginResponse, RegisterAdminRequest, RegisterAdminResponse } from 'shared'
import { isError, filterValues } from '../util/functions'
import { Newable } from '../util/types'
import { terminalColors } from '../util/constants/styles'
import axios from 'axios'
import { SERVER_URI, PUBLIC_API_URI } from '../config'
import { OK } from 'http-status-codes'
import io from 'socket.io-client'
import { Validator } from 'tsdv-joi/Validator'

interface IFetchArguments<Req extends object, Res extends object> {
	eventType: EventType
	requestType?: Req extends void ? void : Newable<Req>
	responseType?: Newable<Res>
	request?: Req
}
export interface IApi {
	connect(query: object): Promise<void>
	fetch<Req extends object, Res extends object>(arg: IFetchArguments<Req, Res>): Promise<Res>
	on<Res extends object>(eventType: string, cb: (res: Res) => void): this
	login(request: AdminLoginRequest): Promise<AdminLoginResponse>
	register(request: RegisterAdminRequest): Promise<RegisterAdminResponse>
}

type PreHook = (req: object) => Promise<object> | object

@injectable()
export default class Api implements IApi {
	private connection: SocketIOClient.Socket

	private readonly validator = new Validator()

	public connect(query: object): Promise<void> {
		return new Promise((resolve, reject) => {
			this.connection = io(SERVER_URI, { query })
			this.connection.once(EventType.Connect, resolve)
			this.connection.once(EventType.Error, reject)
		})
	}

	public async login(request: AdminLoginRequest): Promise<AdminLoginResponse> {
		return this.post('/login', request)
	}

	public async register(request: RegisterAdminRequest): Promise<RegisterAdminResponse> {
		return this.post('/register', request)
	}

	public fetch<Req extends object, Res extends object>({
		eventType,
		requestType,
		request,
		responseType,
	}: IFetchArguments<Req, Res>): Promise<Res> {
		return new Promise(async (resolve, reject) => {
			const _request = filterValues(request || {})

			try {
				requestType && this.validator.validateAsClass(_request, requestType)

				const timeout = setTimeout(() => reject({ eventType, request, message: 'timeout' }), 1000 * 10)

				this.connection.emit(eventType, _request, (data: Res) => {
					const typedResponse = responseType ? Object.assign(new (responseType)(), data) : data
					const response = data

					clearTimeout(timeout)

					if (isError(response)) {
						this.logError(eventType, _request || {}, typedResponse)
						reject(response)
					} else {
						this.logRequest(eventType, _request || {}, typedResponse)
						resolve(response)
					}
				})
			} catch (error) {
				this.logError(eventType, _request, error)
				reject(error)
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

	private async post<Req, Res>(url: string, request: Req): Promise<Res> {
		const res = await axios.post<Res>(PUBLIC_API_URI + url, request)

		if (res.status !== OK) {
			throw new Error('Not authenticated')
		}

		return res.data
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
