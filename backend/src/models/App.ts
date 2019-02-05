import { prop, arrayProp, Typegoose } from 'typegoose'
import { Version } from './Version'
import { LatestVersions } from './LatestVersions'

export class App extends Typegoose {
	@prop({ required: true })
	public name: string

	@prop()
	public pictureUrl: string

	@prop({ unique: true, required: true })
	public bundleId: string

	@arrayProp({ itemsRef: Version })
	public versions: Array<Ref<Version>>

	@prop({ default: new LatestVersions() })
	public latestVersions: LatestVersions
}
