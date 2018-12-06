import { Socket } from 'socket.io';
import bind from 'bind-decorator';

export default class ClientSocket {
	private readonly client: Socket

	constructor(socket: Socket) {
		this.client = socket
	}

	@bind
	on(eventType: string, callback: (...args: any[]) => Promise<any>) {
		this.client.on(eventType, async (...args) => {
			this.client.emit(eventType, await callback(...args))
		})
	}
}