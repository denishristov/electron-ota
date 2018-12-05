import io from 'socket.io-client'
import bind from 'bind-decorator'
import { EventTypes } from 'shared'

export default class UserAPI {
	private readonly socket = io('http://localhost:4000');

	constructor() {
		this.socket.on('connect', function() {
			console.log('connect', arguments)
		});

		this.socket.on('event', function() {
			console.log('event', arguments)
		});

		this.socket.on('disconnect', function() {
			console.log('disconnect', arguments)
		});
	}

	@bind 
	login(email: string, password: string) {
		return this.socket.emit(EventTypes.Login, { email, password })
	}
}

