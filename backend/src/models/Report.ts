import { Typegoose, prop } from 'typegoose'
import { Client } from './Client'

export class Report {
	@prop({ ref: Client })
	public client: Ref<Client>

	@prop()
	public errorMessage?: string

	@prop()
	public timestamp: Date
}
