import {
	controller,
	httpPost,
	BaseHttpController,
	requestBody,
} from 'inversify-express-utils'
import { IAdminsService } from '../services/AdminsService'
import { AdminLoginRequest, RegisterAdminRequest } from 'shared'
import { UNAUTHORIZED } from 'http-status-codes'

@controller('/public')
export default class PublicController extends BaseHttpController {
	constructor(
		@inject(nameof<IAdminsService>())
		private readonly adminsService: IAdminsService,
	) {
		super()
	}

	@httpPost('/login')
	public async login(@requestBody() request: AdminLoginRequest) {
		try {
			return this.ok(await this.adminsService.login(request))
		} catch {
			return this.unauthorized()
		}
	}

	@httpPost('/register')
	public async register(@requestBody() request: RegisterAdminRequest) {
		try {
			return this.ok(await this.adminsService.register(request))
		} catch {
			return this.unauthorized()
		}
	}

	private unauthorized() {
		return this.json({}, UNAUTHORIZED)
	}
}
