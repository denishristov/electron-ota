import { prop, arrayProp, Typegoose } from 'typegoose'
import { Client } from './Client'
import { Version } from './Version'
import { Report } from './Report'

export class VersionReports extends Typegoose {
	@arrayProp({ itemsRef: Client })
	public downloading: Array<Ref<Client>> = []

	@arrayProp({ itemsRef: Client })
	public downloaded: Array<Ref<Client>> = []

	@arrayProp({ itemsRef: Client })
	public using: Array<Ref<Client>> = []

	@arrayProp({ items: Report })
	public errorMessages: Report[] = []

	@prop({ ref: Version, required: true })
	public version: Ref<Version>
}
