import {
	controller,
	httpPost,
	BaseHttpController,
	requestBody,
	response,
	request,
} from 'inversify-express-utils'
import { IAdminsService } from '../services/AdminsService'
import { AdminLoginRequest, RegisterAdminRequest } from 'shared'
import { UNAUTHORIZED } from 'http-status-codes'
import { Response, Request } from 'express-serve-static-core'

const TOKEN_KEY = 'authToken'

@controller('/public')
export default class PublicController extends BaseHttpController {
	constructor(
		@inject(nameof<IAdminsService>())
		private readonly adminsService: IAdminsService,
	) {
		super()
	}

	@httpPost('/login')
	public async login(@requestBody() data: AdminLoginRequest, @response() res: Response) {
		try {
			const { authToken } = await this.adminsService.login(data)
			return this.authenticate(res, authToken)
		} catch (error) {
			console.log(error)
			return this.unauthorized()
		}
	}

	@httpPost('/register')
	public async register(@requestBody() data: RegisterAdminRequest, @response() res: Response) {
		try {
			const { authToken } = await this.adminsService.register(data)
			return this.authenticate(res, authToken)
		} catch (error) {
			console.log(error)
			return this.unauthorized()
		}
	}

	@httpPost('/logout')
	public async logout(@response() res: Response, @request() req: Request) {
		this.adminsService.logout({
			authToken: req.cookies.authToken,
			payload: await this.adminsService.verify(req.cookies.authToken),
		})

		res.clearCookie(TOKEN_KEY)

		return this.ok()
	}

	private authenticate(res: Response, authToken: string) {
		res.cookie(TOKEN_KEY, authToken, { httpOnly: true, sameSite: true  })

		return this.ok()
	}

	private unauthorized() {
		return this.json({}, UNAUTHORIZED)
	}
}
