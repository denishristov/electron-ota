import { Document, Schema } from 'mongoose'

export interface IVersionDocument extends Document {
	versionName: string
	downloadUrl: string
	isCritical: boolean
	isBase: boolean
	isPublished: boolean
	hash: string
	appId: string
	description?: string
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
	hash: {
		type: String,
		unique: true,
	},
	versionName: {
		type: String,
	},
	description: String,
}, {
	timestamps: true,
})
