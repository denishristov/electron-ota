import { Required } from 'tsdv-joi/constraints/any'
import { DateSchema } from 'tsdv-joi/constraints/date'

export class TimestampedDocument {
	@Required()
	@DateSchema()
	public createdAt: string

	@Required()
	@DateSchema()
	public updatedAt: string
}
