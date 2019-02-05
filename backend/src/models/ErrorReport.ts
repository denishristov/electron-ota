import { Ref } from 'typegoose'
import { Client } from './Client'

export class ErrorReport {
	public client: Ref<Client>
	public errorMessage: string
}
