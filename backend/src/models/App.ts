import { prop, arrayProp, Typegoose } from 'typegoose'
import { Version } from './Version'

export class App extends Typegoose {
	@prop({ required: true })
	public name: string

	@prop()
	public pictureUrl: string

	@prop({ unique: true, required: true })
	public bundleId: string

	@arrayProp({ itemsRef: Version })
	public versions: Array<Ref<Version>>
}
