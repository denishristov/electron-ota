import { Document, Schema } from 'mongoose'
import { IVersionDocument } from './Version'

export interface IAppDocument extends Document {
	name: string
	pictureUrl: string
	bundleId: string
	versions: IVersionDocument[]
	latestVersion: IVersionDocument
}

export const AppSchema = new Schema({
	bundleId: String,
	name: String,
	pictureUrl: String,
	latestVersion: {
		ref: 'Version',
		type: Schema.Types.ObjectId,
	},
	versions: [{
		ref: 'Version',
		type: Schema.Types.ObjectId,
	}],
}, {
	timestamps: true,
})
