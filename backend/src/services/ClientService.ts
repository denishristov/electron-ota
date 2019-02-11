import { RegisterClientRequest, RegisterClientResponse, SystemType } from 'shared'
import { Client } from '../models/Client'
import { ModelType } from 'typegoose'
import { ISocketMediator } from '../util/mediator/interfaces'
import { IAppService } from './AppService'

export interface IClientService {
	registerClient(client: RegisterClientRequest): Promise<RegisterClientResponse>
	getClient(clientId: string): Promise<Client>
}

@DI.injectable()
export default class ClientService implements IClientService {
	constructor(
		@DI.inject(DI.Models.Client)
		private readonly ClientModel: ModelType<Client>,
		@DI.inject(DI.Mediators)
		private readonly mediators: Map<string, ISocketMediator>,
		@DI.inject(DI.Services.App)
		private readonly appsService: IAppService,
	) {}

	@bind
	public async registerClient(req: RegisterClientRequest) {
		const { ClientModel } = this

		const client = new ClientModel(req)
		await client.save()

		return { id: client.id }
	}

	public async getClient(clientId: string) {
		return await this.ClientModel.findById(clientId)
	}
}
