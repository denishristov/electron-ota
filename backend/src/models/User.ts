import { Document, Schema } from 'mongoose'

export interface IUserDocument extends Document {
	email: string
	name: string
	password: string
	authTokens: Array<string>
}

export const UserSchema = new Schema({
	email: { 
		type: String, 
		unique: true 
	},
	name: String,
	password: String,
	authTokens: [{ 
		type: String,
		unique: true
	}]
}, { 
	timestamps: true 
})