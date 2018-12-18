import { Document, Schema } from 'mongoose'

export interface IVersionDocument extends Document {
	versionName: string
	downloadUrl: string
	isCritical: boolean
	isBase: boolean
	isPublished: boolean
	appId: string
}

export const VersionSchema = new Schema({
	appId: {
		type: Schema.Types.ObjectId,
		ref: 'App'
	},
	versionName: String,
	downloadUrl: String,
	isCritical: Boolean,
	isBase: Boolean,
	isPublished: Boolean
}, { 
	timestamps: true 
})