import { Document, Schema, model } from 'mongoose'

export interface UserDocument extends Document {
	email: string
	name: string
	password: string
	authTokens: Array<string>
}

const UserSchema = new Schema({
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

export const RegisterPreHook = UserSchema.pre

const User = model<UserDocument>('User', UserSchema)
export default User