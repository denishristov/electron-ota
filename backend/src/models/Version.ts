
import { index, prop, Typegoose } from 'typegoose'
import { SupportSystemTypes } from './SupportSystemTypes'
import { Admin } from './Admin'

@index({ versionName: 1, app: 1 }, { unique: true })
export class Version extends Typegoose {
	public id: string

	public createdAt: string

	public updatedAt: string

	@prop({ required: true })
	public versionName: string

	@prop()
	public downloadUrl?: string

	@prop()
	public fileName?: string

	@prop({ required: true })
	public isCritical: boolean

	@prop({ required: true, default: false })
	public isReleased: boolean

	@prop({ required: true })
	public isBase: boolean

	@prop()
	public hash: string

	@prop({ required: true })
	public appId: string

	@prop()
	public description?: string

	@prop({ required: true })
	public systems: SupportSystemTypes

	@prop({ ref: Admin })
	public releasedBy?: Ref<Admin>
}
