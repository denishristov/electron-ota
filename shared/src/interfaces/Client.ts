export interface IRegisterClientRequest {
	systemType: string
	username: string
	osRelease: string
	sessionId: string
	versionName: string
}

export interface IClientReport {
	sessionId: string
}

export interface IErrorReport extends IClientReport {
	errorMessage: string
}