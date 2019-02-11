import { Ref, prop } from 'typegoose'
import { Client } from './Client'

export class ErrorReport {
	@prop({ ref: Client })
	public client: Ref<Client>

	@prop()
	public errorMessage: string
}
