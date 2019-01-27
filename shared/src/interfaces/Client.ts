export interface IRegisterClientRequest {
	systemType: string
	username: string
	osRelease: string
	clientId: string
	versionName: string
}

export interface IRegisterClientResponse {
	clientId: string
}

export interface IClientReport {
	clientId: string
	versionId: string
}

export interface IErrorReport extends IClientReport {
	errorMessage: string
}
