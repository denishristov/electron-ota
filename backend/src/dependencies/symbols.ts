export const Services = {
	Admin: Symbol.for('User.Service'),
	App: Symbol.for('App.Service'),
	Version: Symbol.for('Version.Service'),
	FileUpload: Symbol.for('S3.Service'),
	RegisterCredentials: Symbol.for('RegisterAdmin.Service'),
	Update: Symbol.for('Update.Service'),
	Client: Symbol.for('Client.Service'),
	VersionStatistics: Symbol.for('Version.Statistics'),
}

export const Models = {
	Admin: Symbol.for('User.Model'),
	App: Symbol.for('App.Model'),
	Version: Symbol.for('Version.Model'),
	Update: Symbol.for('Update.Model'),
	VersionStatistics: Symbol.for('UpdateStatistics.Model'),
	Client: Symbol.for('Client.Model'),
}

export const Hooks = {
	Auth: Symbol.for('Hook.Auth'),
	UpdateClientsMediator: Symbol.for('Hook.UpdateClientsMediator'),
}

export const Factories = {
	ReleaseUpdateHook: Symbol.for('Factory.Hook.Update'),
	ClientsMediator: Symbol.for('Factory.ClientsMediator'),
}

export const Mediators = {
	Admins: Symbol.for('Mediator.Admins'),
}

export const SocketServer = Symbol.for('SocketServer')

export const HTTPServer = Symbol.for('HTTPServer')
