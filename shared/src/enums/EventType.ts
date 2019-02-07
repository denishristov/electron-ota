export enum EventType {
	Connection = 'connection',
	Connect = 'connect',
	Disconnect = 'disconnect',
	Error = 'error',

	Login = 'login',
	Logout = 'logout',
	Authentication = 'authentication',
	EditProfile = 'profile.edit',
	DeleteProfile = 'profile.delete',

	GetApps = 'app.get',
	CreateApp = 'app.create',
	UpdateApp = 'app.update',
	DeleteApp = 'app.delete',

	GetVersions = 'version.get',
	CreateVersion = 'version.create',
	UpdateVersion = 'version.update',
	DeleteVersion = 'version.delete',

	SimpleVersionReports = 'version.reports.simple',
	VersionReports = 'version.reports',

	SignUploadVersionUrl = 's3.sign.upload.versions',
	SignUploadPictureUrl = 's3.sign.upload.pictures',

	ReleaseUpdate = 'update.release',
	CheckForUpdate = 'update.check',
	NewUpdate = 'update.new',

	GetRegisterKeyPath = 'register.path',
	RegisterAdmin = 'register',

	RegisterClient = 'client.register',
	UpdateDownloading = 'client.downloading',
	UpdateDownloaded = 'client.downloaded',
	UpdateUsing = 'client.using',
	UpdateError = 'client.error',
}
