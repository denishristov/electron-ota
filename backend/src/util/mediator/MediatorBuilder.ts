import Mediator from "./Mediator"
import { EventType } from "shared"
import { IMediator, IHandler, IHook } from "./Interfaces"

export default abstract class MediatorBuilder {
	private constructor() {}

	static buildNamespaceMediator(
		clients: SocketIO.Namespace, 
		handlers: IHandler[], 
		preHooks?: IHook[], 
		postHooks?: IHook[]
	): IMediator {
		const mediator = MediatorBuilder.buildMediator(handlers, preHooks, postHooks)
		const roomName = clients.name.substring(1, clients.name.length)

		clients.on(EventType.Connection, (client: SocketIO.Socket) => {
			client.join(roomName, () => {
				console.log('joined ', roomName)
				
				mediator.subscribe(client)
			})
		})

		mediator.usePostRespond({
			handle: async(eventType: EventType, data: any) => {
				console.log(eventType, data)
				clients.to(roomName).emit(eventType, data)
			}
		})

		return mediator
	}

	static buildMediator(
		handlers: IHandler[], 
		preHooks?: IHook[], 
		postHooks?: IHook[]
	): IMediator {
		const mediator = new Mediator()

		mediator.addHandlers(...handlers)
		preHooks && mediator.usePreRespond(...preHooks)
		postHooks && mediator.usePostRespond(...postHooks)

		return mediator
	}
}