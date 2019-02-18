import { Validator } from 'tsdv-joi'
import { Empty } from './types'

export default class ValidationHook {
	private readonly validator = new Validator()

	@bind
	public async handle(data: object) {
		return data instanceof Empty
			? data
			: await this.validator.validate(data)
	}
}
