import { EventType } from 'shared'
import { IAdminsService } from '../services/AdminsService'
import { IPreRespondHook, IClient } from '../util/mediator/interfaces'
import { interfaces } from 'inversify'

export interface IAuthHook extends IPreRespondHook {
	handle(client: IClient, data?: object): Promise<object>
}

export type NamespaceAuthHook = (client: SocketIO.Socket, next: (err?: Error) => void) => void

export function namespaceAuthHook({ container }: interfaces.Context) {
	const authHook = container.get<IAuthHook>(nameof<IAuthHook>())

	return (client: SocketIO.Socket, next: (err?: Error) => void) => {
		try {
			authHook.handle(client)
			next()
		} catch (error) {
			next(error)
		}
	}
}

@injectable()
export default class AuthHook implements IAuthHook {
	constructor(
		@inject(nameof<IAdminsService>())
		private readonly userService: IAdminsService,
	) {}

	@bind
	public async handle(client: IClient, data: object) {
		const { authToken } = client.handshake.query
		const payload = await this.userService.verify(authToken)

		if (!payload) {
			throw new Error('Auth token is invalid')
		}

		return { ...data, authToken, payload }
	}
}
