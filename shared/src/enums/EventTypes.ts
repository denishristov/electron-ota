export enum EventType {
	Connection = 'connection',
	Connect = 'connect',	
	Disconnect = 'disconnect',
	Error = 'error',
	Login = 'login',
	Authentication = 'authentication',
	GetApps = 'app.get',
	CreateApp = 'app.create',
	UpdateApp = 'app.update',
	DeleteApp = 'app.delete',
	GetVersions = 'version.get',
	CreateVersion = 'version.create',
	UpdateVersion = 'version.update',
	DeleteVersion = 'version.delete',
	SignCreateVersionUrl = 's3.versions.sign.create'
}