import { prop, arrayProp, Typegoose } from 'typegoose'
import { Version } from './Version'
import { Report } from './Report'

export class VersionReports extends Typegoose {
	@arrayProp({ items: Report })
	public downloading: Report[] = []

	@arrayProp({ items: Report })
	public downloaded: Report[] = []

	@arrayProp({ items: Report })
	public using: Report[] = []

	@arrayProp({ items: Report })
	public errorMessages: Report[] = []

	@prop({ ref: Version, required: true, unique: true })
	public version: Ref<Version>
}
