import { prop, arrayProp, Typegoose } from 'typegoose'
import { Client } from './Client'
import { Version } from './Version'
import { Report } from './Report'

export class VersionReports extends Typegoose {
	@arrayProp({ itemsRef: Report })
	public downloading: Array<Ref<Report>> = []

	@arrayProp({ itemsRef: Report })
	public downloaded: Array<Ref<Report>> = []

	@arrayProp({ itemsRef: Report })
	public using: Array<Ref<Report>> = []

	@arrayProp({ items: Report })
	public errorMessages: Array<Ref<Report>> = []

	@prop({ ref: Version, required: true })
	public version: Ref<Version>
}
