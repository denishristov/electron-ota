import { Document, Schema, model } from 'mongoose'

export interface VersionDocument extends Document {
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

const Version = model<VersionDocument>('Version', VersionSchema)
export default Version