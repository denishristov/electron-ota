export const Services = {
	User: Symbol.for('User.Service'),
	App: Symbol.for('App.Service'),
	Version: Symbol.for('Version.Service'),
	Update: Symbol.for('Service.Update'),
	FileUpload: Symbol.for('S3.Service'),
}

export const Models = {
	User: Symbol.for('User.Model'),
	App: Symbol.for('App.Model'),
	Version: Symbol.for('Version.Model'),
}

export const Hooks = {
	Auth: Symbol.for('Hook.Auth'),
	UpdateClientsMediator: Symbol.for('Hook.UpdateClientsMediator'),
}

export const Factories = {
	Mediator: Symbol.for('Factory.Mediator'),
	ReleaseUpdateHook: Symbol.for('Factory.Hook.Update'),
	ClientsMediator: Symbol.for('Factory.ClientsMediator'),
}

export const Mediators = {
	Admins: Symbol.for('Mediator.Admins'),
}

export const SocketServer = Symbol.for('SocketServer')

export const HTTPServer = Symbol.for('HTTPServer')
