import { EventType, IAppModel } from 'shared'

enum Room {
	Darwin = 'macos',
	Linux = 'linux',
	Windows_NT = 'windows',
}

export default class AppClientService {
	private readonly namespace: SocketIO.Namespace

	constructor(private readonly app: IAppModel, server: SocketIO.Server) {
		this.namespace = server.of(`/${app.bundleId}`)

		this.namespace.on(EventType.Connection, (appClient: SocketIO.Socket) => {
			const osType: string = appClient.handshake.query.type
			const room = Room[osType as keyof object]

			appClient.join(room, () => {
				// tslint:disable-next-line:no-console
				console.log('client joined room' + room)
			})
		})
	}
}
