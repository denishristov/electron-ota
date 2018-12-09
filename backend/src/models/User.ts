import bcrypt from 'bcrypt-nodejs'
import mongoose from 'mongoose'

export interface IUser {
	email: string
	name: string
	password: string
	authTokens: Array<string>
}

const userSchema = new mongoose.Schema({
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

userSchema.pre("save", function save(next) {
	const user = this as UserDocument

	if (!user.isModified("password")) { 
		return next()
	}

	bcrypt.genSalt(10, (error, salt) => {
		if (error) { 
			return next(error)
		}

		bcrypt.hash(user.password, salt, void 0, (error: mongoose.Error, hash) => {
			if (error) { 
				return next(error)
			}
				 
			user.password = hash
			next()
		})
	})
})

export type UserDocument = mongoose.Document & IUser

const User = mongoose.model<UserDocument>('User', userSchema)
export default User