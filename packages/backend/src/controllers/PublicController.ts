import { injectable, inject } from 'inversify'
import {
		controller, httpGet, BaseHttpController, HttpResponseMessage, StringContent,
} from 'inversify-express-utils'

@controller('/')
export default class PublicController extends BaseHttpController {
	@httpGet('/')
	public async get() {
			const response = new HttpResponseMessage(200)
			response.content = new StringContent('foo')
			return response
	}
}
