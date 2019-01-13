export enum Server {
	Connect = 'connect',
	CheckForUpdate = 'update.check',
	NewUpdate = 'update.new',
	Register = 'client.register',
	Downloading = 'client.downloading',
	Downloaded = 'client.downloaded',
	Error = 'client.error',
	Using = 'client.using',
}

export enum UpdateService {
	Error = 'error',
	Update = 'update',
}
