import { Socket } from 'socket.io'
import bind from 'bind-decorator'

interface ISubscription {
	eventType: string
	callback: (...args: any[]) => Promise<any>
}

class Subscription implements ISubscription {
	readonly eventType: string
	readonly callback: (...args: any[]) => Promise<void>
	
	constructor(eventType: string, callback: (...args: any[]) => Promise<any>) {
		this.eventType = eventType
		this.callback = callback
	}
}

export default class ClientSocket {
	// private readonly subscriptions: ISubscription[]

	constructor(private readonly client: Socket) {}

	@bind
	subscribe(eventType: string, callback: (...args: any[]) => Promise<any>) {
		const responseCallback = async (data: any, ack: Function) => {
			const response = await callback(data)

			if (response) {
				ack(response)
			}
		}

		// const subscription = new Subscription(eventType, responseCallback)
		// this.subscriptions.push(subscription)

		this.client.on(eventType, responseCallback)
	}

	// @bind
	// unsubscribe() {

	// }

	@bind
	unsubscribeAll() {
		// this.client.removeAllListeners()
		// this.subscriptions.forEach(subsription => )
	}
}