
import { EventType } from 'shared'
import { IPreRespondHook } from '../util/mediator/interfaces'
import { Validator } from 'tsdv-joi'

@DI.injectable()
export default class ValidationHook implements IPreRespondHook {
	private readonly validator = new Validator()

	@bind
	public async handle(_: EventType, req: object) {
		return await this.validator.validate(req)
	}
}
