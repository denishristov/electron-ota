
import { EventType } from 'shared'
import { IPreRespondHook } from '../util/mediator/interfaces'
import { Validator } from 'tsdv-joi'

export interface IValidationHook extends IPreRespondHook {
	handle(eventType: EventType, req: object): Promise<object>
}

@injectable()
export default class ValidationHook implements IValidationHook {
	private readonly validator = new Validator()

	@bind
	public async handle(eventType: EventType, req: object) {
		return await this.validator.validate(req)
	}
}
