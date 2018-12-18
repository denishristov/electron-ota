export const Services = {
	User: Symbol.for('User.Service'),
	App: Symbol.for('App.Service'),
	Version: Symbol.for('Version.Service'),
	S3: Symbol.for("S3.Service"),
}

export const Handlers = {
	User: {
		Authentication: Symbol.for('User.Authentication'),
		Login: Symbol.for('User.Login'),
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
		SignUploadVersion: Symbol.for("S3.SignUploadVersion"),
	},
}

export const Models = {
	User: Symbol.for('User.Model'),
	App: Symbol.for('App.Model'),
	Version: Symbol.for('Version.Model'),
}