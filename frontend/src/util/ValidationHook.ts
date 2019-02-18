import { Validator } from 'tsdv-joi'
import { Empty } from './types'
import { AdminLoginRequest } from 'shared';

export default class ValidationHook {
	private readonly validator = new Validator()

	@bind
	public async handle(data: object) {
		console.log(data instanceof AdminLoginRequest, data)
		return data instanceof Empty
			? data
			: await this.validator.validate(data)
	}
}
