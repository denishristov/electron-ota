import { EventType } from 'shared'
import { IHandler, IHook, IMediator } from './Interfaces'
import Mediator from './Mediator'

export default abstract class MediatorBuilder {

	public static buildNamespaceMediator(
		clients: SocketIO.Namespace,
		handlers: IHandler[],
		preHooks?: IHook[],
		postHooks?: IHook[],
	): IMediator {
		const mediator = MediatorBuilder.buildMediator(handlers, preHooks, postHooks)
		const roomName = clients.name.substring(1, clients.name.length)

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
				clients.to(roomName).emit(eventType, data)
			},
		})

		return mediator
	}

	public static buildMediator(
		handlers: IHandler[],
		preHooks?: IHook[],
		postHooks?: IHook[],
	): IMediator {
		const mediator = new Mediator()

		mediator.addHandlers(...handlers)
		preHooks && mediator.usePreRespond(...preHooks)
		postHooks && mediator.usePostRespond(...postHooks)

		return mediator
	}
	private constructor() {}
}
