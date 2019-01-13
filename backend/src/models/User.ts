import { Document, Schema } from 'mongoose'

export interface IAdminDocument extends Document {
	email: string
	name: string
	password: string
	authTokens: string[]
}

export const IAdminSchema = new Schema({
	authTokens: [{
		type: String,
		unique: true,
	}],
	email: {
		type: String,
		unique: true,
	},
	name: String,
	password: String,
}, {
	timestamps: true,
})
