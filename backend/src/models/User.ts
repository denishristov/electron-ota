import { Document, Schema } from 'mongoose'

export interface IUserDocument extends Document {
	email: string
	name: string
	password: string
	authTokens: string[]
}

export const UserSchema = new Schema({
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
