import { Required } from 'tsdv-joi/constraints/any'
import { Timestamp } from 'tsdv-joi/constraints/date'

export class TimestampedDocument {
	@Timestamp()
	@Required()
	public createdAt: string

	@Timestamp()
	@Required()
	public updatedAt: string
}
