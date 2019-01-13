import { Document, Schema } from 'mongoose'
import { IVersionDocument } from './Version'
import { SystemType } from 'shared'
import { IReleaseDocument } from './Release'
import { VERSION_REF } from './constants'

export interface IAppDocument extends Document {
	name: string
	pictureUrl: string
	bundleId: string
	versions: IVersionDocument[]
	latestVersions: {
		[key in SystemType]: IVersionDocument
	}
}

export const AppSchema = new Schema({
	bundleId: String,
	name: String,
	pictureUrl: String,
	versions: [VERSION_REF],
	latestVersions: {
		Windows_RT: VERSION_REF,
		Darwin: VERSION_REF,
		Linux: VERSION_REF,
	},
}, {
	timestamps: true,
})
