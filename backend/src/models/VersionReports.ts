import { prop, arrayProp, Typegoose } from 'typegoose'
import { Client } from './Client'
import { Version } from './Version'
import { ErrorReport } from './ErrorReport'

// tslint:disable-next-line:max-classes-per-file
export class VersionReports extends Typegoose {
	@arrayProp({ itemsRef: Client })
	public downloading: Array<Ref<Client>> = []

	@arrayProp({ itemsRef: Client })
	public downloaded: Array<Ref<Client>> = []

	@arrayProp({ itemsRef: Client })
	public using: Array<Ref<Client>> = []

	@arrayProp({ itemsRef: ErrorReport })
	public errorMessages: Array<Ref<ErrorReport>> = []

	@prop({ ref: Version, required: true })
	public version: Ref<Version>
}
