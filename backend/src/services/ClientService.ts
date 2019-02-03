import { RegisterClientRequest, RegisterClientResponse } from 'shared'
import { Model } from 'mongoose'
import { IClientDocument } from '../models/Client'

export interface IClientService {
	registerClient(client: RegisterClientRequest): Promise<RegisterClientResponse>
	getClient(clientId: string): Promise<IClientDocument>
}

@DI.injectable()
export default class ClientService implements IClientService {
	constructor(
		@DI.inject(DI.Models.Client)
		private readonly clients: Model<IClientDocument>,
	) {}

	@bind
	public async registerClient(client: RegisterClientRequest) {
		const { id } = await this.clients.create(client)

		return { id }
	}

	public async getClient(clientId: string) {
		return await this.clients.findById(clientId)
	}
}
