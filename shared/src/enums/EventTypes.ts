export enum EventType {
	Connection = 'connection', // back end
	Connect = 'connect', // front end
	Disconnect = 'disconnect',
	Error = 'error',
	Login = 'login',
	Authentication = 'authentication',
	GetApps = 'app.get',
	CreateApp = 'app.create',
	UpdateApp = 'app.update',
	DeleteApp = 'app.delete',
}