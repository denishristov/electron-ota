import { EventType } from 'shared'
import { IHandler, IPreRespondHook, IMediator, IPostRespondHook, IClient } from './Interfaces'
import Mediator from './Mediator'

export default abstract class MediatorBuilder {

	public static buildNamespaceMediator(
		clients: SocketIO.Namespace,
		handlers: IHandler[],
		preHooks?: IPreRespondHook[],
		postHooks?: IPostRespondHook[],
	): IMediator {
		const roomName = clients.name.substring(1, clients.name.length)
		const room = clients.to(roomName)
		const mediator = MediatorBuilder.buildMediator(room, handlers, preHooks, postHooks)

		clients.on(EventType.Connection, (client: SocketIO.Socket) => {
			client.join(roomName, () => {
				// tslint:disable-next-line:no-console
				console.log('joined ', roomName)

				mediator.subscribe(client)
			})
		})

		mediator.usePostRespond({
			handle: async (eventType: EventType, data: object) => {
				// tslint:disable-next-line:no-console
				console.log(eventType, data)
				room.emit(eventType, data)
			},
		})

		return mediator
	}

	public static buildMediator(
		clients: IClient,
		handlers: IHandler[],
		preHooks?: IPreRespondHook[],
		postHooks?: IPostRespondHook[],
	): IMediator {
		const mediator = new Mediator(clients)

		mediator.addHandlers(...handlers)
		preHooks && mediator.usePreRespond(...preHooks)
		postHooks && mediator.usePostRespond(...postHooks)

		return mediator
	}
	private constructor() {}
}
