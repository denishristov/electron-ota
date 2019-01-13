import { IRegisterClientRequest } from 'shared'
import { Model } from 'mongoose'
import { IClientDocument } from '../models/Client'

export interface IClientService {
	registerClient(client: IRegisterClientRequest): Promise<void>
	getClient(sessionId: string, withVersion?: boolean): Promise<IClientDocument>
}

@DI.injectable()
export default class ClientService implements IClientService {
	constructor(
		@DI.inject(DI.Models.Client)
		private readonly clients: Model<IClientDocument>,
	) {}

	@bind
	public async registerClient(client: IRegisterClientRequest) {
		await this.clients.create(client)
	}

	public async getClient(sessionId: string, withVersion = false) {
		const query = this.clients.findById(sessionId)

		return withVersion
			? await query.populate('version')
			: await query
	}
}
