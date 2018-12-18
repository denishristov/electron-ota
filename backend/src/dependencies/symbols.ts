export const Services = {
	User: Symbol.for('User'),
	App: Symbol.for('App'),
	Version: Symbol.for('Version'),
	S3: Symbol.for("S3"),
}

export const Handlers = {
	User: {
		Authentication: Symbol.for('Authentication'),
		Login: Symbol.for('Login'),
	},
	App: {
		Get: Symbol.for('App.Get'),
		Create: Symbol.for('App.Create'),
		Update: Symbol.for('App.Update'),
		Delete: Symbol.for('App.Delete'),
	},
	Version: {
		Get: Symbol.for('Version.Get'),
		Create: Symbol.for('Version.Create'),
		Update: Symbol.for('Version.Update'),
		Delete: Symbol.for('Version.Delete'),
	},
	S3: {
		SignUploadVersion: Symbol.for("SignUploadVersion"),
	},
}