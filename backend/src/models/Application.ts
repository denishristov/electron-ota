import { Document, Schema, model } from 'mongoose'

export interface ApplicationDocument extends Document {
	name: string
	iconUploadId: string
	isCritical: boolean
}

export const ApplicationSchema = new Schema({
	name: String,
	iconUploadId: String,
	isCritical: Boolean
}, { 
	timestamps: true 
})

const Application = model<ApplicationDocument>('application', ApplicationSchema)
export default Application