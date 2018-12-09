import mongoose from 'mongoose'

export interface IApplication {
	name: string
	iconUploadId: string
}

export interface IApplicationUpdate {
	id: string
	name?: string
	iconUploadId?: string
}

const applicationSchema = new mongoose.Schema({
	name: String,
	iconUploadId: String,
	
}, { 
	timestamps: true 
})

export type ApplicationDocument = mongoose.Document & IApplication

const Application = mongoose.model<ApplicationDocument>('application', applicationSchema)
export default Application