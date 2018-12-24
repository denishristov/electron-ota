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
		ref: 'App',
		type: Schema.Types.ObjectId,
	},
	downloadUrl: String,
	isBase: Boolean,
	isCritical: Boolean,
	isPublished: Boolean,
	versionName: {
		type: String,
		unique: true,
	},
}, {
	timestamps: true,
})
