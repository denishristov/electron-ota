import { prop, arrayProp, Typegoose } from 'typegoose'

export class Admin extends Typegoose {
	@prop({ unique: true, required: true })
	public email: string

	@prop({ unique: true, required: true })
	public name: string

	@prop({ required: true })
	public password: string

	@prop()
	public pictureUrl: string

	@arrayProp({ items: String, unique: true, default: [] })
	public authTokens: string[]
}
