import { Socket } from 'socket.io';
import bind from 'bind-decorator';

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
	private readonly client: Socket
	// private readonly subscriptions: ISubscription[]

	constructor(socket: Socket) {
		this.client = socket
	}

	@bind
	subscribe(eventType: string, callback: (...args: any[]) => Promise<any>) {
		const responseCallback = async (...args: any[]) => {
			const response = await callback(...args)

			if (response) {
				this.client.emit(eventType, response)
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