import bind from "bind-decorator"
import { EventType, IResponse } from 'shared'
import connection from './connection'
import { injectable } from "inversify";

export interface IApi {
	emit<Res extends IResponse = IResponse>(eventType: EventType, request?: object | undefined): Promise<Res>
	on<Res extends IResponse>(eventType: string, ack: (res: Res) => void): void
	preEmit<Req extends object, T>(ack: (data: T) => T & Req): void
}

@injectable()
export default class Api implements IApi {
	private readonly preEmitHooks: Function[] = []

	@bind
	preEmit<Req extends object, T>(ack: (data: T) => T & Req): void {
		this.preEmitHooks.push(ack)
	}

	emit<Res extends IResponse = IResponse>(eventType: EventType, request?: object): Promise<Res> {
		return new Promise((resolve, reject) => {
			const timeout = setTimeout(() => reject('timeout'), 1000 * 30)
			connection.emit(eventType, this.attachData(request || {}), (data: Res) => {
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
	on<Res extends IResponse = IResponse>(eventType: string, ack: (res: Res) => void): void {
		connection.on(eventType, (res: Res) => {
			if (res && res.errorMessage) {
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