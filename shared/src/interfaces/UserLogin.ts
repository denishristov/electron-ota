export interface IUserLoginRequest {
	email: string
	password: string
}

export interface IUserLoginResponse {
	isAuthenticated: boolean
	authToken?: string
	errorMessage?: string
}