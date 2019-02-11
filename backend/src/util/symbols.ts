export const Services = {
	Admin: Symbol.for('Admin.Service'),
	App: Symbol.for('App.Service'),
	Version: Symbol.for('Version.Service'),
	FileUpload: Symbol.for('S3.Service'),
	RegisterCredentials: Symbol.for('RegisterAdmin.Service'),
	Update: Symbol.for('Update.Service'),
	Client: Symbol.for('Client.Service'),
	VersionReports: Symbol.for('Version.Reports'),
}

export const Models = {
	Admin: Symbol.for('Admin.Model'),
	App: Symbol.for('App.Model'),
	Version: Symbol.for('Version.Model'),
	Update: Symbol.for('Update.Model'),
	VersionReports: Symbol.for('UpdateReports.Model'),
	Client: Symbol.for('Client.Model'),
}

export const Hooks = {
	Validation: Symbol.for('Hook.Validation'),
	Auth: Symbol.for('Hook.Auth'),
	ClientMediatorManager: Symbol.for('Hook.CreateClientsMediator'),
	Report: Symbol.for('Hook.Report'),
	ReleaseUpdate: Symbol.for('Hook.ReleaseUpdate'),
}

export const Factories = {
	AdminsMediator: Symbol.for('Mediator.Admins'),
	ClientsMediator: Symbol.for('Factory.ClientsMediator'),
}

export const Mediators = Symbol.for('Mediators')

export const Server = Symbol.for('Server')

export const AdminMediator = '/admins'
