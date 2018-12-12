import { Document, Schema, model } from 'mongoose'

export interface AppDocument extends Document {
	name: string
	iconUploadId: string
	isCritical: boolean
}

export const AppSchema = new Schema({
	name: String,
	iconUploadId: String,
	isCritical: Boolean
}, { 
	timestamps: true 
})

const App = model<AppDocument>('app', AppSchema)
export default App