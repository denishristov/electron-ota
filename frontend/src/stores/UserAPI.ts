import io from 'socket.io-client'
import bind from 'bind-decorator'
import { EventTypes, IUserLoginResponse, IUserAuthenticationResponse } from 'shared'

export default class UserAPI {
	private readonly socket = io('http://localhost:4000')

	/**
	 *
	 */
	constructor() {
		this.socket.on(`login`, console.log)
		this.socket.on(EventTypes.Authentication, console.log)
	}

	@bind
	onLogin(callback: (userLoginResponse: IUserLoginResponse) => void) {
		this.socket.on(EventTypes.Login, callback)
	}

	@bind 
	login(email: string, password: string): void {
		this.socket.emit(EventTypes.Login, { email, password })
	}

	@bind
	onAuthentication(callback: (userAuthenticationResponse: IUserAuthenticationResponse) => void) {
		this.socket.on(EventTypes.Authentication, callback)
	}

	@bind
	authenticate(authToken: string): void {
		this.socket.emit(EventTypes.Authentication, { authToken })
	}
}

