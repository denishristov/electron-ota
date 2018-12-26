export const Services = {
	User: Symbol.for('User.Service'),
	App: Symbol.for('App.Service'),
	Version: Symbol.for('Version.Service'),
	AppUpdate: Symbol.for('App.Update'),
	S3: Symbol.for('S3.Service'),
}

export const Models = {
	User: Symbol.for('User.Model'),
	App: Symbol.for('App.Model'),
	Version: Symbol.for('Version.Model'),
}

export const Hooks = {
	Auth: Symbol.for('Hook.Auth'),
}

export const Factories = {
	Mediator: Symbol.for('Factory.Mediator'),
}
