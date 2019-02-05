import { Ref, prop } from 'typegoose'
import { Version } from './Version'

export class LatestVersions {
	@prop({ ref: Version })
	// tslint:disable-next-line:variable-name
	public Windows_RT: Ref<Version> | null = null

	@prop({ ref: Version })
	public Darwin: Ref<Version> | null = null

	@prop({ ref: Version })
	public Linux: Ref<Version> | null = null
}
