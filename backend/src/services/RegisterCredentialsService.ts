import { REGISTER_KEY } from '../config/index'
import { ModelType } from 'typegoose'
import { Admin } from '../models/Admin'

export interface IRegisterCredentialsService {
	verify(key: string): Promise<boolean>
}

@injectable()
export default class RegisterCredentialsService implements IRegisterCredentialsService {
	constructor(
		@inject(nameof<Admin>())
		private readonly AdminModel: ModelType<Admin>,
	) { }

	@bind
	public async verify(key: string) {
		const [firstAdmin] = await this.AdminModel.find().limit(1)
		return !firstAdmin && key === REGISTER_KEY
	}
}
