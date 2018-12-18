import { Document, Schema, Model } from 'mongoose'
import { IVersionDocument } from './Version'

export interface IAppDocument extends Document {
	name: string
	pictureUrl: string
	bundleId: string
	versions: IVersionDocument[]
}

export const AppSchema = new Schema({
	name: String,
	pictureUrl: String,
	bundleId: String,
	versions: [{
		type: Schema.Types.ObjectId,
		ref: 'Version'
	}] 
}, { 
	timestamps: true 
})