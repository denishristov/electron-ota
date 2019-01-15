import { IRegisterClientRequest, IRegisterClientResponse } from 'shared'
import { Model } from 'mongoose'
import { IClientDocument } from '../models/Client'

export interface IClientService {
	registerClient(client: IRegisterClientRequest): Promise<IRegisterClientResponse>
	getClient(clientId: string, withVersion?: boolean): Promise<IClientDocument>
}

@DI.injectable()
export default class ClientService implements IClientService {
	constructor(
		@DI.inject(DI.Models.Client)
		private readonly clients: Model<IClientDocument>,
	) {}

	@bind
	public async registerClient(client: IRegisterClientRequest) {
		const { id } = await this.clients.create(client)

		return { clientId: id }
	}

	public async getClient(clientId: string, withVersion = false) {
		const query = this.clients.findById(clientId)

		return withVersion
			? await query.populate('version')
			: await query
	}
}
