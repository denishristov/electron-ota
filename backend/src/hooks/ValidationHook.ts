import { IPreRespondHook, IClient } from '../util/mediator/interfaces'
import { Validator } from 'tsdv-joi'

export interface IValidationHook extends IPreRespondHook {
	handle(client: IClient, req: object): Promise<object>
}

@injectable()
export default class ValidationHook implements IValidationHook {
	private readonly validator = new Validator()

	@bind
	public async handle(client: IClient, req: object) {
		return await this.validator.validate(req)
	}
}
