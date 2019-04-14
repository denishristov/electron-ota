import { RegisterClientRequest, RegisterClientResponse, SystemType } from 'shared'
import { Client } from '../models/Client'
import { ModelType } from 'typegoose'
export interface IClientService {
	registerClient(client: RegisterClientRequest): Promise<RegisterClientResponse>
}

@injectable()
export default class ClientService implements IClientService {
	constructor(
		@inject(nameof<Client>())
		private readonly ClientModel: ModelType<Client>,
	) {}

	@bind
	public async registerClient(req: RegisterClientRequest) {
		const { ClientModel } = this

		const client = new ClientModel(req)
		await client.save()

		return { id: client.id }
	}
}
