import { Document, Schema } from 'mongoose'
import { SystemType } from 'shared'

export interface IReleaseDocument extends Document {
	systems: {
		[key in SystemType]: boolean
	}
	clientsCount?: number
}

export const ReleaseSchema = new Schema({
	systems: {
		Windows_RT: Boolean,
		Darwin: Boolean,
		Linux: Boolean,
	},
	clientsCount: Number,
}, {
	timestamps: true,
})
