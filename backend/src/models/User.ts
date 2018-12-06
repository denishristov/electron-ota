import bcrypt from 'bcrypt-nodejs'
import mongoose from 'mongoose'

export interface IUser {
	email: string,
	password: string
}

export type UserModel = mongoose.Document & {
	email: string
	password: string
	matchesPassword: (password: string) => Promise<boolean>
}

const userSchema = new mongoose.Schema({
	email: { 
		type: String, 
		unique: true 
	},
	password: String,
	
}, { 
	timestamps: true 
})

userSchema.methods.matchesPassword = function(password: string): Promise<boolean> {
	return new Promise((resolve, reject) => {
		bcrypt.compare(password, this.password, (error: mongoose.Error, isMatch: boolean) => {
			error && reject(error)
			resolve(isMatch)
		});
	})
}

userSchema.pre("save", function save(next) {
	const user = this as UserModel

	if (!user.isModified("password")) { 
		return next()
	}

	bcrypt.genSalt(10, (error, salt) => {
		if (error) { 
			return next(error)
		}

		bcrypt.hash(user.password, salt, undefined, (error: mongoose.Error, hash) => {
			if (error) { 
				return next(error)
			}
				 
			user.password = hash
			next()
		});
	});
});

const User = mongoose.model('User', userSchema)

// const admin = new User({
// 	email: 'admin@ora.pm',
// 	password: 'admin'
// })

// admin.save(console.log)
  
export default User