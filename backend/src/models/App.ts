import { Document, Schema, model } from 'mongoose'
import { VersionDocument } from './Version';

export interface AppDocument extends Document {
	name: string
	pictureUrl: string
	bundleId: string
	versions: VersionDocument[]
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

const App = model<AppDocument>('App', AppSchema)
export default App