import { Ref } from 'typegoose'
import { Version } from './Version'

export class LatestVersions {
	// tslint:disable-next-line:variable-name
	public Windows_RT: Ref<Version> | null = null

	public Darwin: Ref<Version> | null = null

	public Linux: Ref<Version> | null = null
}
