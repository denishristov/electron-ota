import { Version } from './Version'
import { SystemType } from 'shared'
import { prop, Typegoose } from 'typegoose'

export class Client extends Typegoose {
	@prop({ required: true })
	public username: string

	@prop()
	public osRelease: string

	@prop({ ref: Version })
	public version: Ref<Version>

	@prop({ enum: SystemType })
	public systemType: SystemType
}
