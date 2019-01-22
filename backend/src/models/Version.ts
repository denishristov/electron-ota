import { Document, Schema } from 'mongoose'
import { SystemType } from 'shared'

export interface IVersionDocument extends Document {
	versionName: string
	downloadUrl: string
	isCritical: boolean
	isReleased: boolean
	isBase: boolean
	hash: string
	appId: string
	description?: string
	systems: {
		[key in SystemType]: boolean
	}
}

export const VersionSchema = new Schema({
	appId: String,
	downloadUrl: String,
	isBase: Boolean,
	isCritical: Boolean,
	isPublished: Boolean,
	isReleased: Boolean,
	hash: {
		type: String,
		unique: true,
	},
	versionName: {
		type: String,
	},
	description: String,
	systems: {
		Windows_RT: Boolean,
		Darwin: Boolean,
		Linux: Boolean,
	},
}, {
	timestamps: true,
})
