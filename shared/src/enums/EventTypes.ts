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
	PublishVersion = 'version.publish',

	SignUploadVersionUrl = 's3.sign.upload.versions',
	SignUploadPictureUrl = 's3.sign.upload.pictures',

	CheckForUpdate = 'update.check',
	NewUpdate = 'update.new',
	SuccessfulUpdate = 'update.success',

	GetRegisterKeyPath = 'register.path',
	Register = 'register'
}