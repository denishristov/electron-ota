import { Document, Schema, model } from 'mongoose'

export interface AppDocument extends Document {
	name: string
	pictureUrl: string
	bundleId: string
	// versions: 
}

export const AppSchema = new Schema({
	name: String,
	pictureUrl: String,
	bundleId: String
}, { 
	timestamps: true 
})

const App = model<AppDocument>('app', AppSchema)
export default App